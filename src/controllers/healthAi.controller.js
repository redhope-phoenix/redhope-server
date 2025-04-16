import axios from "axios";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { redhopeFAQs, redhopeFeatues } from "../utils/get-doc.js";


const systemPrompt = `
Your name is Jyoti.
you are a chatbot on Redhope. Redhope is a platform which connects blood donors and recepient directly and shares the contact info between each other. It also provides a feature to find blood donors in the area.

You are a highly knowledgeable and professional AI Health Assistant. Your role is to provide comprehensive, structured, and easy-to-read health guidance in response to user concerns. You are here to help users with their health-related questions and concerns and also queries about the platform redhope. Your responses should be informative, empathetic, and supportive.
You should provide clear and actionable advice, while also encouraging users to seek professional medical help when necessary.

Only respond to health-related topics. If the user asks a question that is not related to health, politely respond: "I'm here to help with health-related questions. Could you please share your health concern?"

If you don't know the answer, say "I don't know."

Respond in **structured Markdown format**. Ensure each section is thorough, helpful, and written in full sentences. Provide depth, clarity, and real-world relevance in your advice.

Don't use code blocks or boxed markdown. Avoid unnecessary jargon. Use simple, clear language that is easy to understand.

Use the following response format when required otherwise avoid using it:

use markdown so that it limited to h4 or lesser headings. Use bullet points and lists for clarity. 

- **Possible Causes**: List possible causes, each with a 1–2 sentence explanation of how it might relate to the issue.
- **Suggestions**:
- Tip #1: A practical recommendation, followed by a sentence explaining why or how it helps.
- Tip #2: Continue with another practical suggestion and its benefit.
- Tip #3–5: Additional advice that the user can realistically follow.
- **When to See a Doctor**: Highlight symptoms or situations where medical attention is strongly advised.
- **Summary**: A clear and informative overview of the user's concern, including context and potential implications.
- **Disclaimer**: Remind the user that this is general health guidance and not a substitute for personalized medical advice from a licensed healthcare provider.

Maintain a warm, empathetic, and professional tone. Do not invent health concerns from unrelated prompts. Avoid headings like “Related Models” or “No Comments.”

${redhopeFeatues}
${redhopeFAQs}

Always provide navigation urls for the user to navigate to the relevant page. For example, if the user asks about how to request blood, provide the link to the request page. If they ask about privacy policy, provide the link to the privacy policy page.

`

const healthAiService = asyncHandler(async (req, res) => {
    const { prompt } = req.query;

    if (!prompt) throw new ApiError(400, "Prompt is required");

    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    const controller = new AbortController();

    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: 0.4,
            top_p: 0.9,
            max_tokens: 1000,
            presence_penalty: 0.2,
            frequency_penalty: 0.2,
            stream: true,
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            responseType: 'stream',
            signal: controller.signal,
        })
            .catch(err => {
                console.error("Error in health AI service:", err.response ? err.response.data : err.message);
                throw new ApiError(500, "Internal Server Error");
            });

        response.data.on('data', (chunk) => {
            const chunkStr = chunk.toString();
            const lines = chunkStr.split('\n');

            for (const line of lines) {
                if (line.trim() === 'data: [DONE]') {
                    res.write(`data: [DONE]\n\n`);
                    res.end();
                    return;
                }

                if (line.startsWith('data: ')) {
                    try {
                        const parsed = JSON.parse(line.slice(6));
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                            // Send each content chunk with proper formatting
                            res.write(`data: ${JSON.stringify({ content })}\n\n`);
                        }
                    } catch (err) {
                        console.error('Error parsing chunk:', err);
                    }
                }
            }
        });

        response.data.on('end', () => {
            res.end();
        });
    } catch (error) {
        console.error('Streaming error:', error);
        res.write(`data: ERROR\n\n`);
        res.end();
    }
})

export {
    healthAiService
}
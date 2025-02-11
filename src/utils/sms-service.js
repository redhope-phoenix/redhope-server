import axios from "axios";

const sendSms = async (message, number) => {
    const apiKey = process.env.TXTLCL_API_KEY;
    const sender = 'TXTLCL';
    const url = `https://api.textlocal.in/send/?apikey=${apiKey}&numbers=${number}&message=${encodeURIComponent(message)}&sender=${sender}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};

export {sendSms}
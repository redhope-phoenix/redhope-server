import PDFParser from "pdf2json"

const pdfToText = async (filePath) => {
    let text = "";
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataReady', pdfData => {
        for (const page of pdfData.Pages) {
            for (const textItem of page.Texts) {
                for (const t of textItem.R) {
                    // Decode URL-encoded text and add a space
                    text += decodeURIComponent(t.T) + ' ';
                }
            }
        }

    });

    pdfParser.loadPDF(filePath);

    return text;
}

export { pdfToText };
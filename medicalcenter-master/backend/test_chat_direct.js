const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testChat() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ KEY MISSING");
        return;
    }
    console.log("Using Key:", process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = "gemini-1.5-flash";

    try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("RESPONSE:", response.text());
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

testChat();

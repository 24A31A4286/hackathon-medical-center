const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy init to get access to client if needed, or just use genAI
        // Actually the SDK doesn't expose listModels directly on the client instance in some versions?
        // Let's check typical usage or just try to use the API manually if SDK fails?
        // Wait, the error message itself suggests "Call ListModels". 
        // In the Node SDK, it might not be straightforward to just "list models" without a model instance? 
        // Actually, create a simple script that just tries to generate content with "gemini-pro" and if it fails, we catch it.
        // But we already know it fails.

        // Let's try to curl the API if possible? No, windows.

        // Let's try 'gemini-1.0-pro' as a fallback code in this script.

        // Attempting to list models using a fetch execution if SDK doesn't support it easily?
        // Actually, newer SDK has no direct listModels method on GenerativeModel logic. It's usually a separate manager.
        // But let's try a different model name that is very likely to exist: "gemini-1.5-flash-001" or "gemini-1.0-pro-latest"

        console.log("Testing Model Access...");

        const modelsToTest = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.0-pro", "gemini-1.5-pro"];

        for (const m of modelsToTest) {
            console.log(`Testing: ${m}`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                console.log(`SUCCESS: ${m} works!`);
                break;
            } catch (e) {
                console.log(`FAILED: ${m} - ${e.message}`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ KEY MISSING");
        return;
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        console.log("Fetching available models...");
        // Accessing the model listing via the generativeModel if possible, 
        // or just trying a known valid reference if the SDK exposes it.
        // The SDK doesn't always have a direct 'listModels' on the client instance in some versions,
        // but let's try to verify if we can list them or test standard names.

        // Actually, for the Node SDK, we might not have a direct list method easily accessible without looking at docs.
        // Instead, let's test a few specific model strings to see which ones return 404 and which don't.

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-latest",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        for (const modelName of candidates) {
            console.log(`\nTesting model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                console.log(`✅ ${modelName} is AVAILABLE. Response: ${JSON.stringify(result.response.text())}`);
            } catch (error) {
                if (error.message.includes("404") || error.message.includes("not found")) {
                    console.error(`❌ ${modelName} NOT FOUND (404)`);
                } else if (error.message.includes("429")) {
                    console.log(`⚠️ ${modelName} EXISTS but Rate Limited (429)`);
                } else {
                    console.error(`❌ ${modelName} Error: ${error.message}`);
                }
            }
        }

    } catch (error) {
        console.error("Global Error:", error);
    }
}

listModels();

require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ NO API KEY FOUND IN ENV");
    process.exit(1);
}

console.log(`🔑 Using API Key: ${API_KEY.substring(0, 10)}...`);

async function checkModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    console.log(`🌐 Fetching: ${url.replace(API_KEY, 'HIDDEN_KEY')}`);

    try {
        const res = await fetch(url);
        console.log(`Startus: ${res.status} ${res.statusText}`);

        if (!res.ok) {
            const errText = await res.text();
            console.error("❌ API Error:", errText);
            return;
        }

        const data = await res.json();
        if (data.models) {
            const names = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace('models/', ''));

            console.log("✅ Models found:", names);
            require('fs').writeFileSync('model_results.json', JSON.stringify(names, null, 2));
        } else {
            console.log("⚠️ No 'models' property in response:", data);
            require('fs').writeFileSync('model_results.json', JSON.stringify({ error: "No models found", data }, null, 2));
        }

    } catch (error) {
        console.error("🔥 Network/Fetch Error:", error.message);
        require('fs').writeFileSync('model_results.json', JSON.stringify({ error: error.message }, null, 2));
    }
}

checkModels();

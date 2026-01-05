const https = require('https');
const fs = require('fs');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log("Fetching models with key: " + key.substring(0, 10) + "...");

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        try {
            const parsed = JSON.parse(data);
            fs.writeFileSync('gemini_debug_log.json', JSON.stringify(parsed, null, 2));
            console.log("Log saved to gemini_debug_log.json");

            if (parsed.error) {
                console.error("API Error:", parsed.error.message);
            } else if (parsed.models) {
                console.log("Available Models:");
                parsed.models.forEach(m => console.log(` - ${m.name}`));
            } else {
                console.log("Unknown response structure");
            }
        } catch (e) {
            console.error("Parse Error:", e.message);
            console.log("Raw Data:", data);
        }
    });

}).on("error", (err) => {
    console.error("Network Error:", err.message);
});

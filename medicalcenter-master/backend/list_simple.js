const https = require('https');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
if (!key) { console.log("NO_KEY"); process.exit(1); }

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log("Fetching " + url.replace(key, "KEY"));

https.get(url, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("MODELS:", json.models.map(m => m.name));
            } else {
                console.log("ERROR_JSON:", json);
            }
        } catch (e) { console.log("RAW:", data); }
    });
}).on('error', e => console.log("ERR:", e.message));

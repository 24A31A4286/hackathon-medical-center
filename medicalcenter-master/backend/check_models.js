require('dotenv').config();
const https = require('https');

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("AVAILABLE MODELS:");
                json.models.forEach(m => console.log(m.name));
            } else {
                console.log("ERROR:", json);
            }
        } catch (e) {
            console.log("Raw Data:", data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

const express = require("express");
const router = express.Router();
require("dotenv").config();

/* ===============================
   CHAT ROUTE (Direct REST API)
================================ */

router.post("/", async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in backend .env");
        }

        if (!req.body || !req.body.message) {
            return res.status(400).json({
                message: "Request body must contain a 'message' field"
            });
        }

        const userMessage = req.body.message;
        const apiKey = process.env.GEMINI_API_KEY;

        // Define models to try (Direct REST Endpoints)
        // Define models to try (Direct REST Endpoints)
        const models = [
            "gemini-2.5-flash",
            "gemini-2.5-pro",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash",
            "gemini-pro"
        ];

        let finalReply = null;
        let lastError = null;
        let usedModel = null;

        for (const model of models) {
            try {
                console.log(`🔄 [REST] Trying model: ${model}`);
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are Medi AI, a medical assistant. Rules: Provide general info only. NO diagnosis. NO prescriptions. ALWAYS advise consulting a doctor. User: ${userMessage}`
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`API Error (${response.status}): ${errText}`);
                }

                const data = await response.json();

                // Extract reply
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    finalReply = data.candidates[0].content.parts[0].text;
                    usedModel = model;
                    console.log(`✅ Success with ${model}`);
                    break;
                } else {
                    throw new Error("Invalid API response format (no candidates)");
                }

            } catch (err) {
                console.error(`❌ Failed with ${model}:`, err.message);
                lastError = err;
            }
        }

        /* ---------- Auto-Discovery Fallback ---------- */
        if (!finalReply) {
            console.log("⚠️ All hardcoded models failed. Attempting Auto-Discovery...");
            try {
                const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                const listRes = await fetch(listUrl);
                const listData = await listRes.json();

                if (listData.models) {
                    // Find first available model that supports generation
                    const availableModels = listData.models
                        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                        .map(m => m.name.replace("models/", ""));

                    console.log("🔎 Discovered Models:", availableModels);

                    for (const autoModel of availableModels) {
                        if (models.includes(autoModel)) continue; // Already tried

                        console.log(`🔄 [Auto] Trying discovered model: ${autoModel}`);
                        const url = `https://generativelanguage.googleapis.com/v1beta/models/${autoModel}:generateContent?key=${apiKey}`;

                        const response = await fetch(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: `You are Medi AI. User: ${userMessage}` }] }]
                            })
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.candidates && data.candidates.length > 0) {
                                finalReply = data.candidates[0].content.parts[0].text;
                                usedModel = autoModel;
                                console.log(`✅ Success with Auto-Discovered ${autoModel}`);
                                break;
                            }
                        }
                    }
                }
            } catch (discoveryErr) {
                console.error("❌ Auto-Discovery Failed:", discoveryErr.message);
            }
        }

        if (!finalReply) {
            throw lastError || new Error("All models failed via REST API");
        }

        res.json({
            reply: finalReply,
            modelUsed: usedModel
        });

    } catch (error) {
        console.error("🔥 Final Chat Error:", error.message);
        res.status(500).json({
            message: "Failed to get AI response",
            error: error.message,
            details: error.toString()
        });
    }
});

/* ===============================
   DEBUG ROUTE: List Models
================================ */
router.get("/models", async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const names = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace('models/', ''));
            res.json({ models: names, raw: data.models });
        } else {
            res.status(404).json({ error: "No models found", details: data });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/authMiddleware');

router.post('/analyze-pitch', auth, async (req, res) => {
    try {
        const { pitch } = req.body;
        console.log("Analyzing pitch of length:", pitch?.length);

        if (!pitch || pitch.trim().length < 10) {
            return res.status(400).json({ error: "Please provide a more detailed pitch (at least 10 characters)." });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("GROQ_API_KEY is missing!");
            return res.status(500).json({ error: "GROQ_API_KEY is missing in backend .env file." });
        }

        const groq = new Groq({ apiKey });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a startup expert. Analyze the following pitch. Provide 3 bullet points on 'Market Potential' and 1 'Critical Warning'."
                },
                { role: "user", content: pitch }
            ],
            model: "llama-3.3-70b-versatile",
        });

        if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
            throw new Error("No response from Groq AI model.");
        }

        res.json({ analysis: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error("Groq AI Error:", error.message || error);
        res.status(500).json({
            error: "AI Agent Error",
            details: error.message || "Unknown error occurred"
        });
    }
});

module.exports = router;
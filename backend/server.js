import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import Interaction from './models/Interaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Allow localhost for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }

        // Allow Vercel deployments (matches *.vercel.app)
        if (origin.includes('vercel.app')) {
            return callback(null, true);
        }

        // Add your custom domain here if you have one
        // if (origin === 'https://yourdomain.com') {
        //     return callback(null, true);
        // }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/ask-ai', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({
                error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY in .env file'
            });
        }

        console.log('📤 Sending request to OpenRouter API...');


        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.FRONTEND_URL || 'https://your-app.vercel.app',
                    'X-Title': 'AI Flow App'
                }
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        console.log('✅ Received response from OpenRouter API');

        res.json({ response: aiResponse });

    } catch (error) {
        console.error('❌ Error calling OpenRouter API:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to get AI response',
            details: error.response?.data?.error || error.message
        });
    }
});


app.post('/api/save', async (req, res) => {
    try {
        const { prompt, response } = req.body;

        if (!prompt || !response) {
            return res.status(400).json({ error: 'Both prompt and response are required' });
        }

        const interaction = new Interaction({
            prompt,
            response
        });

        await interaction.save();
        console.log('✅ Interaction saved to MongoDB');

        res.status(201).json({
            message: 'Interaction saved successfully',
            data: interaction
        });

    } catch (error) {
        console.error('❌ Error saving interaction:', error);
        res.status(500).json({
            error: 'Failed to save interaction',
            details: error.message
        });
    }
});


app.get('/api/interactions', async (req, res) => {
    try {
        const interactions = await Interaction.find().sort({ createdAt: -1 });
        res.json({ data: interactions });
    } catch (error) {
        console.error('❌ Error fetching interactions:', error);
        res.status(500).json({
            error: 'Failed to fetch interactions',
            details: error.message
        });
    }
});


app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// utils/toxicityCheck.js
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function checkToxicity(message) {
  try {
    const response = await openai.moderations.create({
      input: message,
    });

    const result = response.results[0];

    return result.flagged; // true = toxic
  } catch (err) {
    console.error('Moderation API error:', err);
    return false; // fallback to allow message if API fails
  }
}

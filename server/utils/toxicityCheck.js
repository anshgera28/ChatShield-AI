// utils/toxicityCheck.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY;

export async function checkToxicity(message) {
  try {
    const response = await axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`,
      {
        comment: { text: message },
        languages: ['en'],
        requestedAttributes: { TOXICITY: {} },
      }
    );

    const score = response.data.attributeScores.TOXICITY.summaryScore.value;
    return score;
  } catch (error) {
    console.error('Error calling Perspective API:', error.response?.data || error.message);
    // Return 0 so message isn't blocked if API fails
    return 0;
  }
}

import { ChatOpenAI } from '@langchain/openai';
import * as fs from 'fs';
import { CONFIG } from '../configs/config'

export async function generateDataset() {
  console.log('⏳ Generating travel dataset using OpenAI...');

  const model = new ChatOpenAI({
    openAIApiKey: CONFIG.AI_SERVICE.API_KEY,
    modelName: 'gpt-4o',
  });
  const prompt = `
  You are an AI assistant responsible for generating engaging and informative travel-based guessing game data. 
  Your goal is to create structured game prompts with fun facts, trivia, and clues that make the game both educational and entertaining.

  Generate a JSON dataset of 100 cities, ensuring JSON validity. Each entry should have the following structure:

  {
    "city": "Paris",
    "country": "France",
    "aiGeneratedHints": [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art."
    ],
    "funFact": [
      "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
    ],
    "trivia": [
      "This city is famous for its croissants and macarons. Bon appétit!",
      "Paris was originally a Roman city called Lutetia."
    ]
   
    
  }

  Ensure:
  - Each city has **2 unique clues** to help the player guess it.
  - Each city has **2 interesting and lesser-known fun facts**.
  - Each city has **2 engaging trivia questions** related to its culture, history, or geography.
  - The dataset is output **only as valid JSON** without extra formatting.

  Return the JSON dataset for seamless integration into the travel guessing game.
`;

  try {
    const response = await model.invoke(prompt);
    console.log('response', response);
    const datasetText =
      typeof response.content === 'string'
        ? response.content
        : response.content || '';

    if (!response) {
      throw new Error('Invalid response format from OpenAI.');
    }
    fs.writeFileSync('dataset.json', datasetText.toString(), 'utf-8');
    console.log('✅ Dataset successfully generated!');
  } catch (error) {
    console.error('❌ Error generating dataset:', error);
  }
}

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const fallbackMessages =
  "What's your favorite way to spend a weekend?||If you could learn any skill instantly, what would it be?||What's the best piece of advice you've ever received?";

export async function GET() {
  try {
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      prompt:
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.",
    });

    return new Response(result.textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[BACKEND ERROR]', error);

    return new Response(fallbackMessages, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// ✅ Allow POST to use same logic
export async function POST() {
  return GET();
}

import { Groq } from 'groq-sdk';

const groqApi = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = new Groq({
  apiKey: groqApi,
  dangerouslyAllowBrowser: true,
});

export const requestToGroq = async (content: string) => {
  const response = await groq.chat.completions.create({
    messages: [
        {
            role: 'user',
            content,
        }
    ],
    model: "llama-3.1-8b-instant"
  })
  return response.choices[0]?.message?.content ?? "";
}
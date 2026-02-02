import { Groq } from 'groq-sdk';

const groqApi = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = new Groq({
  apiKey: groqApi,
  dangerouslyAllowBrowser: true,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const requestToGroq = async (messages: Message[]) => {
  const response = await groq.chat.completions.create({
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    model: "llama-3.1-8b-instant"
  });
  
  return response.choices[0]?.message?.content ?? "";
}
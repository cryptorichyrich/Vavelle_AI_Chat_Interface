import { Groq } from 'groq-sdk'
const GROQ_API = import.meta.env.VITE_GROQ;

const groq = new Groq({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true
})

export const requestToGroqAi = async (messages) => {
  // Convert your message format to Groq API format
  const formattedMessages = messages.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));

  // Add the new user message if not already in the array
  const lastMessage = messages[messages.length - 1];
  if (lastMessage && lastMessage.type === 'user' && !formattedMessages.find(m => m.role === 'user' && m.content === lastMessage.content)) {
    formattedMessages.push({
      role: 'user',
      content: lastMessage.content
    });
  }

  const reply = await groq.chat.completions.create({
    messages: formattedMessages,
    model: "llama3-8b-8192"
  });
  
  return reply.choices[0].message.content;
}
import { useState, useRef, useEffect } from 'react';
import './App.css';
import { requestToGroqAi } from './utils/groq';
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message to messages
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      // Pass the entire message history to the AI
      const aiResponse = await requestToGroqAi(updatedMessages);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'An error occurred while fetching the response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-900">
      <Header onClearChat={() => setMessages([])} />
      
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        messagesEndRef={messagesEndRef}
        setInputValue={setInputValue}
      />
      
      <ChatInput 
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        textareaRef={textareaRef}
      />
    </main>
  );
}

export default App;
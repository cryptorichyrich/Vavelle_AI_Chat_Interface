import { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';
import { requestToGroqAi } from './utils/groq';

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

  const renderMessageContent = (content, messageType) => {
    if (typeof content !== 'string') return null;
    
    // For user messages, just display as plain text
    if (messageType === 'user') {
      return <p className="text-sm whitespace-pre-wrap">{content}</p>;
    }
    
    // Parse content for code blocks and formatting
    const blocks = [];
    let currentBlock = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';
    
    content.split('\n').forEach((line, index) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          if (currentBlock.length > 0) {
            blocks.push({ type: 'text', content: currentBlock.join('\n') });
            currentBlock = [];
          }
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim() || 'plaintext';
          codeBlockContent = '';
        } else {
          blocks.push({ type: 'code', content: codeBlockContent.trim(), language: codeBlockLanguage });
          inCodeBlock = false;
        }
      } else if (inCodeBlock) {
        codeBlockContent += line + '\n';
      } else {
        currentBlock.push(line);
      }
    });
    
    if (currentBlock.length > 0) {
      blocks.push({ type: 'text', content: currentBlock.join('\n') });
    }
    
    return blocks.map((block, index) => {
      if (block.type === 'code') {
        return (
          <div key={index} className="my-3 relative group">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
              <span className="text-xs text-gray-400">{block.language}</span>
              <button
                onClick={() => navigator.clipboard.writeText(block.content)}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs"
              >
                Copy
              </button>
            </div>
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={block.language}
              PreTag="div"
              className="rounded-b-lg !mt-0 !mb-0"
            >
              {block.content}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        // Simple markdown-like formatting
        return block.content.split('\n').map((line, lineIndex) => {
          if (!line.trim()) return <br key={`${index}-${lineIndex}`} />;
          
          let formatted = line
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
          
          return (
            <p key={`${index}-${lineIndex}`} 
               className="mb-2 last:mb-0 text-left" 
               dangerouslySetInnerHTML={{ __html: formatted }} 
            />
          );
        });
      }
    });
  };

  return (
    <main className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Vavelle AI Chat</h1>
              <p className="text-xs text-gray-400">Designed by Biotama.tech, Powered by GroqCloud</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([])}
            className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-700/50"
          >
            Clear Chat
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-200 mb-2">Welcome to Groq AI Chat</h2>
              <p className="text-gray-400 mb-4">Start a conversation by typing a message below</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setInputValue("What can you help me with?")}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  What can you help me with?
                </button>
                <button
                  onClick={() => setInputValue("Explain what Groq AI is")}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Explain what Groq AI is
                </button>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[85%] lg:max-w-[75%]`}>
                <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-indigo-600' 
                      : message.type === 'error'
                      ? 'bg-red-900/50'
                      : 'bg-gray-700'
                  }`}>
                    {message.type === 'user' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    ) : message.type === 'error' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-white font-bold">G</span>
                    )}
                  </div>
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : message.type === 'error'
                      ? 'bg-red-900/30 text-red-200 rounded-bl-sm border border-red-900/50'
                      : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                  }`}
                >
                  <div className={`text-sm ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {renderMessageContent(message.content, message.type)}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-indigo-200 text-right' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-end">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                  <span className="text-white font-bold">G</span>
                </div>
                <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-lg px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                placeholder="Type your message..."
                className="w-full bg-gray-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isLoading}
                rows={1}
                style={{ minHeight: '44px', maxHeight: '200px' }}
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`p-4 rounded-xl transition-all duration-200 ${
                isLoading || !inputValue.trim()
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </main>
  );
}

export default App;
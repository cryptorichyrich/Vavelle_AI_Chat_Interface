import { useState } from 'react';
import './App.css';
import { requestToGroqAi } from './utils/groq';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    try {
      const aiResponse = await requestToGroqAi(inputValue);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setResponse('An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderText = (text) => {
    if (typeof text !== 'string') return null;
    
    const blocks = [];
    let currentBlock = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';
    
    text.split('\n').forEach((line, index) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Starting a code block
          if (currentBlock.length > 0) {
            blocks.push({ type: 'text', content: currentBlock.join('\n') });
            currentBlock = [];
          }
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim() || 'plaintext';
          codeBlockContent = '';
        } else {
          // Ending a code block
          blocks.push({ type: 'code', content: codeBlockContent, language: codeBlockLanguage });
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
          <div key={index} className="relative group mt-4 mb-4 text-left">
            <div className="absolute right-3 top-3 z-10">
              <button
                onClick={() => navigator.clipboard.writeText(block.content)}
                className="bg-gray-700/80 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded text-xs transition-colors text-left"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg overflow-x-auto border border-gray-700/50 text-left">
              <code className={`text-sm font-mono text-gray-200 language-${block.language} text-left`}>
                {block.content}
              </code>
            </pre>
          </div>
        );
      } else {
        // Process text content
        return block.content.split('\n').map((line, lineIndex) => {
          if (!line.trim() && lineIndex === 0) return null;
          
          let formatted = line
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-gray-200">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-800/80 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-sm">$1</code>');
          
          return (
            <p key={`${index}-${lineIndex}`} className="mb-4 leading-relaxed text-gray-200 text-left" dangerouslySetInnerHTML={{ __html: formatted }} />
          );
        });
      }
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <header className="text-center py-8 md:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-indigo-400">React</span> × <span className="text-emerald-400">Groq AI</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg">Explore the power of conversational AI</p>
        </header>

        <div className="bg-gray-800/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                Your Message
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  placeholder="Ask me anything..."
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 min-h-[60px] max-h-[200px] resize-y"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  rows={2}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => setInputValue('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                isLoading || !inputValue.trim()
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-indigo-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>

          {response && (
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700/50">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <h2 className="text-sm font-medium text-gray-300">AI Response</h2>
              </div>
              <div className="space-y-4">
                {renderText(response)}
              </div>
            </div>
          )}
        </div>

        <footer className="text-left mt-8 text-gray-500 text-xs sm:text-sm">
          Powered by React and Groq AI
        </footer>
      </div>
    </main>
  );
}

export default App;
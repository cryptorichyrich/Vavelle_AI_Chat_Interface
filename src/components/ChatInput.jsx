import React from 'react';

const ChatInput = ({ 
  inputValue, 
  setInputValue, 
  handleInputChange, 
  handleSubmit, 
  isLoading, 
  textareaRef 
}) => {
  return (
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
  );
};

export default ChatInput;
import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, isLoading, messagesEndRef, setInputValue }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Welcome to  Chat</h2>
            <p className="text-gray-400 mb-4">Start a conversation by typing a message below</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setInputValue("What can you help me with?")}
                className="text-sm px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                What can you help me with?
              </button>
              <button
                onClick={() => setInputValue("Explain what Vavelle AI powered by GroqCloud is?")}
                className="text-sm px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Explain what Vavelle AI powered by GroqCloud is?
              </button>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
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
  );
};

export default MessageList;
import React from 'react';
import MessageContent from './MessageContent';

const MessageItem = ({ message }) => {
  return (
    <div
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
            <MessageContent content={message.content} messageType={message.type} />
          </div>
          <div className={`text-xs mt-1 ${
            message.type === 'user' ? 'text-indigo-200 text-right' : 'text-gray-500'
          }`}>
            {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
import React from 'react';

const Header = ({ onClearChat }) => {
  return (
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
          onClick={onClearChat}
          className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-700/50"
        >
          Clear Chat
        </button>
      </div>
    </header>
  );
};

export default Header;
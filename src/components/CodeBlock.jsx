import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, content }) => {
  return (
    <div className="my-3 relative group">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
        <span className="text-xs text-gray-400">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(content)}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs"
        >
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="rounded-b-lg !mt-0 !mb-0"
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
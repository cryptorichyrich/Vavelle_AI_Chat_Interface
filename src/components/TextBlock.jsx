import React from 'react';

const TextBlock = ({ content, lineIndex, blockIndex }) => {
  if (!content.trim()) return <br key={`${blockIndex}-${lineIndex}`} />;
  
  // Simple markdown-like formatting
  let formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
  
  return (
    <p 
      key={`${blockIndex}-${lineIndex}`} 
      className="mb-2 last:mb-0 text-left" 
      dangerouslySetInnerHTML={{ __html: formatted }} 
    />
  );
};

export default TextBlock;
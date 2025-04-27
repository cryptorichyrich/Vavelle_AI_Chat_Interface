import React from 'react';
import CodeBlock from './CodeBlock';
import TextBlock from './TextBlock';

const MessageContent = ({ content, messageType }) => {
  if (typeof content !== 'string') return null;
  
  // For user messages, just display as plain text
  if (messageType === 'user') {
    return <p className="text-sm whitespace-pre-wrap text-left">{content}</p>;
  }
  
  // Parse content for code blocks and formatting
  const blocks = [];
  let currentBlock = [];
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLanguage = '';
  
  content.split('\n').forEach((line) => {
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
      return <CodeBlock key={index} language={block.language} content={block.content} />;
    } else {
      return block.content.split('\n').map((line, lineIndex) => (
        <TextBlock 
          key={`${index}-${lineIndex}`}
          content={line} 
          blockIndex={index} 
          lineIndex={lineIndex} 
        />
      ));
    }
  });
};

export default MessageContent;
import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const { role, content, recipe } = message;
  
  return (
    <div className={`chat-message ${role === 'user' ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        {recipe && recipe.image && (
          <div className="recipe-image-container">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="recipe-detail-image" 
            />
          </div>
        )}
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
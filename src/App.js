import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaArrowRight, FaPizzaSlice, FaUtensils, FaHeart } from 'react-icons/fa';
import './App.css';
import RecipeCard from './components/RecipeCard';
import ChatMessage from './components/ChatMessage';
import LoadingIndicator from './components/LoadingIndicator';

// Free Spoonacular API key - normally would use env variables
const API_KEY = "0377a21c369343edbb859a5fc71178e9"; // Replace with your actual API key

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: "👋 Hi there! I'm your recipe assistant. Tell me what ingredients you have, and I'll suggest some delicious recipes you can make!" 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Search recipes by ingredients
      const ingredientsQuery = input.toLowerCase()
        .replace(/,/g, ',+')
        .replace(/ /g, ',+');
      
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            apiKey: API_KEY,
            ingredients: ingredientsQuery,
            number: 10, // Number of results to return
            ranking: 1, // 1 = maximize used ingredients, 2 = minimize missing ingredients
            ignorePantry: true
          }
        }
      );
      
      setRecipes(response.data);
      
      // Create bot response message
      let botResponse;
      if (response.data.length === 0) {
        botResponse = { 
          role: 'bot', 
          content: "I couldn't find any recipes with those ingredients. Maybe try something else?" 
        };
      } else {
        botResponse = { 
          role: 'bot', 
          content: `I found ${response.data.length} recipes you can make with those ingredients! Check them out below.` 
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      // Handle API error
      setMessages(prev => [
        ...prev, 
        { 
          role: 'bot', 
          content: "Sorry, I'm having trouble finding recipes right now. Please try again later." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const getRecipeDetails = async (recipeId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        {
          params: {
            apiKey: API_KEY,
            includeNutrition: false
          }
        }
      );
      
      const recipe = response.data;
      const recipeDetails = `## ${recipe.title}\n\n${recipe.servings} servings | ${recipe.readyInMinutes} minutes\n\n` +
                           `### Ingredients:\n\n${recipe.extendedIngredients.map(ing => `- ${ing.original}`).join('\n')}\n\n` +
                           `### Instructions:\n\n${recipe.instructions ? recipe.instructions.replace(/<[^>]*>/g, '') : 'No instructions available.'}`;
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'bot', 
          content: recipeDetails,
          recipe: recipe
        }
      ]);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'bot', 
          content: "Sorry, I couldn't get the details for that recipe." 
        }
      ]);
    } finally {
      setLoading(false);
      setRecipes([]); // Clear the recipe list after selection
    }
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <FaPizzaSlice className="logo" />
        <h1>Pantry Chef</h1>
      </header>
      
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {loading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        {recipes.length > 0 && (
          <div className="recipes-container">
            <h3>Recipes to try <FaUtensils /></h3>
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onClick={() => getRecipeDetails(recipe.id)} 
                />
              ))}
            </div>
          </div>
        )}
        
        <form className="input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter ingredients you have (e.g., chicken, rice, tomatoes)..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            <FaArrowRight />
          </button>
        </form>
      </div>
      
      <footer className="app-footer">
        <p>Made with <FaHeart className="heart-icon" /> by Parth Patel | Powered by Spoonacular API</p>
      </footer>
    </div>
  );
}

export default App;
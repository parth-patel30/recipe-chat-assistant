import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="recipe-image">
        <img src={recipe.image} alt={recipe.title} />
      </div>
      <div className="recipe-info">
        <h4>{recipe.title}</h4>
        <div className="recipe-meta">
          <span>
            <FaInfoCircle className="info-icon" />
            {recipe.usedIngredientCount} ingredients used
          </span>
          {recipe.missedIngredientCount > 0 && (
            <span className="missing">
              {recipe.missedIngredientCount} missing
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
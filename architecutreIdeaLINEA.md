# Next.js/React Conversion Example

This document shows how the Flask application could be converted to use Next.js (React) for the frontend while keeping the backend API functionality.

## Current Architecture (Flask)

The current application uses:
- Flask for both frontend (templates) and backend (API)
- SQLite database
- Server-side rendering with Jinja2 templates
- Mixed concerns (frontend and backend in same codebase)

## Proposed Architecture (Next.js + API)

```
Next.js Frontend (React)  ↔  API Backend (Flask/FastAPI/Node.js)  ↔  SQLite Database
```

## Key Changes Needed

### 1. Separate Frontend and Backend

Instead of Flask serving both HTML templates and API endpoints, we would:
- Create a Next.js application for the frontend
- Keep Flask (or convert to FastAPI/Node.js) as a dedicated API backend
- Use API calls from React to fetch data

### 2. Next.js Frontend Structure

```
dinner-served-at-ate/
├── frontend/                  # Next.js application
│   ├── pages/
│   │   ├── index.js          # Home page
│   │   ├── recipes/
│   │   │   └── [id].js       # Recipe detail page
│   │   └── api/              # API routes (optional)
│   ├── components/
│   │   ├── RecipeCard.js
│   │   ├── RecipeDetail.js
│   │   └── Layout.js
│   ├── styles/
│   │   └── globals.css
│   ├── lib/
│   │   └── api.js           # API client
│   └── package.json
│
├── backend/                   # Flask/FastAPI backend
│   ├── app.py
│   ├── requirements.txt
│   └── app.db
│
└── README.md
```

## Example Next.js Components

### RecipeCard.js (React Component)

```jsx
import Link from 'next/link';

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <h2>{recipe.title}</h2>
      <p>Time: {recipe.time_minutes} minutes</p>
      <p>Price: ${recipe.price}</p>
      <div className="tags">
        {recipe.tags.map(tag => (
          <span key={tag.id} className="tag">{tag.name}</span>
        ))}
      </div>
      <Link href={`/recipes/${recipe.id}`}>
        <a className="view-details">View Recipe</a>
      </Link>
    </div>
  );
}
```

### pages/index.js (Home Page)

```jsx
import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import Layout from '../components/Layout';
import { fetchRecipes } from '../lib/api';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;

  return (
    <Layout>
      <h1>Dinner Served at 8</h1>
      <div className="recipes-grid">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </Layout>
  );
}
```

### pages/recipes/[id].js (Recipe Detail Page)

```jsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { fetchRecipeById } from '../../lib/api';

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      async function loadRecipe() {
        try {
          const data = await fetchRecipeById(id);
          setRecipe(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      loadRecipe();
    }
  }, [id]);

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;
  if (!recipe) return <Layout><div>Recipe not found</div></Layout>;

  return (
    <Layout>
      <div className="recipe-detail">
        <h1>{recipe.title}</h1>
        <div className="recipe-meta">
          <span>Time: {recipe.time_minutes} minutes</span>
          <span>Price: ${recipe.price}</span>
        </div>
        
        <div className="recipe-tags">
          {recipe.tags.map(tag => (
            <span key={tag.id} className="tag">{tag.name}</span>
          ))}
        </div>

        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {recipe.ingredients.map(ingredient => (
            <li key={ingredient.id}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>

        <h2>Instructions</h2>
        <div className="recipe-description">
          {recipe.description.split('\n').map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>

        {recipe.link && (
          <div className="recipe-link">
            <a href={recipe.link} target="_blank" rel="noopener noreferrer">
              View Original Recipe
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
```

### lib/api.js (API Client)

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipe/recipes/`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

export async function fetchRecipeById(id) {
  const response = await fetch(`${API_BASE_URL}/recipe/recipes/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipe');
  }
  return response.json();
}

export async function createRecipe(recipeData) {
  const response = await fetch(`${API_BASE_URL}/recipe/recipes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeData),
  });
  if (!response.ok) {
    throw new Error('Failed to create recipe');
  }
  return response.json();
}

// Add more API functions as needed...
```

## Backend API (Flask - Simplified)

The backend would remain largely the same but would only serve API endpoints, not HTML templates. Here's what the simplified Flask backend might look like:

```python
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'app.db'

# ... (keep database functions the same) ...

# Remove template routes, keep only API routes
@app.route('/api/recipe/recipes/', methods=['GET'])
def recipe_recipes_list():
    # ... (same implementation) ...
    return jsonify(result), 200

@app.route('/api/recipe/recipes/<int:id>/', methods=['GET'])
def recipe_recipes_retrieve(id):
    # ... (same implementation) ...
    return jsonify(recipe_data), 200

# ... (keep all other API routes) ...

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)  # Different port from Next.js
```

## Benefits of This Approach

1. **Separation of Concerns**: Frontend and backend are clearly separated
2. **Better Developer Experience**: React/Next.js provides modern frontend tooling
3. **Improved Performance**: Next.js supports static generation and server-side rendering
4. **Scalability**: Easier to scale frontend and backend independently
5. **Modern UI**: Access to rich React ecosystem and component libraries
6. **API Flexibility**: Can use the same API for web, mobile, or other clients

## Migration Steps

1. **Set up Next.js project**: `npx create-next-app frontend`
2. **Convert Flask routes**: Remove template routes, keep only API endpoints
3. **Create React components**: Convert Jinja templates to React components
4. **Implement API client**: Create functions to call backend API
5. **Set up routing**: Use Next.js file-based routing
6. **Style components**: Use CSS modules or styled-components
7. **Test and deploy**: Verify everything works together

## Considerations

- **CORS**: Need to configure CORS on the backend to allow frontend requests
- **Authentication**: Would need to implement JWT or session-based auth
- **Environment Variables**: Use `.env` files for API URLs and secrets
- **Deployment**: Next.js can be deployed to Vercel, Netlify, or any Node.js host
- **Backend**: Flask backend can be deployed separately or converted to serverless

Would you like me to elaborate on any specific part of this conversion?
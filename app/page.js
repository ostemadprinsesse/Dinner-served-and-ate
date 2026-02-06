import Link from 'next/link';

async function getRecipes() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/recipe/recipes/`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch recipes: ${res.status}`);
  }
  return res.json();
}

export default async function HomePage() {
  const recipes = await getRecipes();

  return (
    <div>
      <h2 style={{ fontFamily: 'Comic Sans MS, Arial, sans-serif', color: '#ff0066', textAlign: 'center' }}>
        📖 Browse Our Amazing Recipes! 📖
      </h2>
      <hr style={{ height: 5, border: 0, background: '#ff00ff' }} />

      {recipes.length === 0 ? (
        <p
          style={{
            fontFamily: 'Comic Sans MS, Arial, sans-serif',
            color: '#ff0000',
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          No recipes found! 😢
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {recipes.map((recipe) => (
            <div key={recipe.id} className="card cardYellow">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 22, color: '#0000ff', fontWeight: 800 }}>{recipe.title}</div>
                  <div className="muted" style={{ marginTop: 10 }}>
                    ⏰ <b>Time:</b> {recipe.time_minutes} minutes
                    <br />
                    💰 <b>Price:</b> ${recipe.price}
                    <br />
                    🏷️ <b>Tags:</b>{' '}
                    {recipe.tags.map((t, idx) => (
                      <span key={t.id} style={{ color: '#ff0066', fontWeight: 700 }}>
                        {t.name}
                        {idx < recipe.tags.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <Link className="button" href={`/recipes/${recipe.id}/`}>
                  VIEW RECIPE
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

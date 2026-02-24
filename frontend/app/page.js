import Link from 'next/link';

async function getRecipes() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3005';
  const res = await fetch(`${baseUrl}/api/recipe/recipes`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch recipes: ${res.status}`);
  }
  return res.json();
}

export default async function Home() {
  const recipes = await getRecipes();

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Comic Sans MS, Arial, sans-serif', color: '#ff0066', textAlign: 'center' }}>
        🍽️ DINNER SERVED AT ATE 🍽️
      </h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Retro 90s Recipe Collection</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`} style={{ textDecoration: 'none' }}>
            <div className="card cardGreen" style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
              <h2 style={{ fontFamily: 'Comic Sans MS, Arial, sans-serif', color: '#0000ff', marginBottom: '10px' }}>
                {recipe.title}
              </h2>
              <p>⏰ <b>Time:</b> {recipe.time_minutes} minutes</p>
              <p>💰 <b>Price:</b> ${recipe.price}</p>
              {recipe.tags && recipe.tags.length > 0 && (
                <p>
                  🏷️ <b>Tags:</b> {recipe.tags.map((t) => t.name).join(', ')}
                </p>
              )}
              <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold', color: '#ff0066' }}>
                View Recipe →
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link href="/swagger" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            📚 API Documentation
          </button>
        </Link>
      </div>
    </div>
  );
}

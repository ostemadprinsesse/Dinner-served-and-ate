import Link from 'next/link';

async function getRecipe(id) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/recipe/recipes/${id}/`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch recipe ${id}: ${res.status}`);
  }
  return res.json();
}

export default async function RecipePage({ params }) {
  const recipe = await getRecipe(params.id);
  const steps = recipe.description ? recipe.description.split('\n\n').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div>
      <h2 style={{ fontFamily: 'Comic Sans MS, Arial, sans-serif', color: '#ff0066', textAlign: 'center' }}>
        🍽️ {recipe.title} 🍽️
      </h2>

      <div className="card cardGreen" style={{ marginBottom: 16 }}>
        ⏰ <b>Cooking Time:</b> {recipe.time_minutes} minutes
        <br />
        💰 <b>Estimated Price:</b> ${recipe.price}
        <br />
        {recipe.link ? (
          <>
            🔗 <b>Link:</b>{' '}
            <a href={recipe.link} target="_blank" rel="noreferrer">
              {recipe.link}
            </a>
            <br />
          </>
        ) : null}
        🏷️ <b>Tags:</b>{' '}
        {recipe.tags.map((t, idx) => (
          <span key={t.id} style={{ color: '#ff0066', fontWeight: 800 }}>
            {t.name}
            {idx < recipe.tags.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>

      <div className="card cardPink" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Comic Sans MS, Arial, sans-serif', color: '#0000ff', textAlign: 'center' }}>
          🥕 INGREDIENTS 🥕
        </h3>
        <ul style={{ listStyleType: 'square' }}>
          {recipe.ingredients.map((ing) => (
            <li key={ing.id} style={{ margin: '10px 0' }}>
              <b>
                {ing.amount} {ing.unit}
              </b>{' '}
              - {ing.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="card cardCyan" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Comic Sans MS, Arial, sans-serif', color: '#0000ff', textAlign: 'center' }}>
          👨‍🍳 COOKING INSTRUCTIONS 👨‍🍳
        </h3>
        {steps.length === 0 ? (
          <p>No instructions available.</p>
        ) : (
          <div>
            {steps.map((s) => (
              <p key={s} style={{ lineHeight: 1.6 }}>
                <b>{s}</b>
              </p>
            ))}
          </div>
        )}
      </div>

      <Link className="button" href="/">
        ⬅️ BACK TO HOME
      </Link>
    </div>
  );
}

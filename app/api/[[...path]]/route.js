import { NextResponse } from 'next/server';
import { allAsync, getAsync, openDb, runAsync } from '@/lib/db';

function getSegments(ctx) {
  const segs = ctx?.params?.path;
  if (!segs) return [];
  if (Array.isArray(segs)) return segs.filter(Boolean);
  return [String(segs)].filter(Boolean);
}

function jsonNotFound() {
  return NextResponse.json({ detail: 'Not found' }, { status: 404 });
}

function jsonMethodNotAllowed() {
  return NextResponse.json({ detail: 'Method not allowed' }, { status: 405 });
}

function apiOverview() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return NextResponse.json(
    {
      create_user_url: `${base}/api/user/create/`,
      current_user_url: `${base}/api/user/me/`,
      user_token_url: `${base}/api/user/token/`,
      recipes_url: `${base}/api/recipe/recipes/{?ingredients,tags}`,
      recipe_url: `${base}/api/recipe/recipes/{id}/`,
      recipe_image_url: `${base}/api/recipe/recipes/{id}/upload-image/`,
      ingredients_url: `${base}/api/recipe/ingredients/{?assigned_only}`,
      ingredient_url: `${base}/api/recipe/ingredients/{id}/`,
      tags_url: `${base}/api/recipe/tags/{?assigned_only}`,
      tag_url: `${base}/api/recipe/tags/{id}/`,
    },
    { status: 200 }
  );
}

async function listRecipes() {
  const db = openDb();
  try {
    const recipes = await allAsync(db, 'SELECT id, title, time_minutes, price, link FROM recipes');

    const result = [];
    for (const recipe of recipes) {
      const tags = await allAsync(
        db,
        `
        SELECT t.id, t.name
        FROM tags t
        JOIN recipe_tags rt ON t.id = rt.tag_id
        WHERE rt.recipe_id = ?
        `,
        [recipe.id]
      );

      result.push({
        id: recipe.id,
        title: recipe.title,
        time_minutes: recipe.time_minutes,
        price: recipe.price,
        link: recipe.link ?? '',
        tags,
      });
    }

    return NextResponse.json(result);
  } finally {
    db.close();
  }
}

async function getRecipe(id) {
  if (!Number.isFinite(id)) {
    return NextResponse.json({ detail: 'Invalid recipe id' }, { status: 400 });
  }

  const db = openDb();
  try {
    const recipe = await getAsync(
      db,
      'SELECT id, title, time_minutes, price, link, description FROM recipes WHERE id = ?',
      [id]
    );

    if (!recipe) {
      return NextResponse.json({ detail: 'Recipe not found' }, { status: 404 });
    }

    const ingredients = await allAsync(
      db,
      `
      SELECT i.id, i.name, ri.amount, ri.unit
      FROM ingredients i
      JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = ?
      `,
      [id]
    );

    const tags = await allAsync(
      db,
      `
      SELECT t.id, t.name
      FROM tags t
      JOIN recipe_tags rt ON t.id = rt.tag_id
      WHERE rt.recipe_id = ?
      `,
      [id]
    );

    return NextResponse.json({
      id: recipe.id,
      title: recipe.title,
      time_minutes: recipe.time_minutes,
      price: recipe.price,
      link: recipe.link ?? '',
      description: recipe.description ?? '',
      ingredients,
      tags,
    });
  } finally {
    db.close();
  }
}

async function listIngredients() {
  const db = openDb();
  try {
    const ingredients = await allAsync(db, 'SELECT id, name FROM ingredients');
    return NextResponse.json(ingredients);
  } finally {
    db.close();
  }
}

async function listTags() {
  const db = openDb();
  try {
    const tags = await allAsync(db, 'SELECT id, name FROM tags');
    return NextResponse.json(tags);
  } finally {
    db.close();
  }
}

export async function GET(req, ctx) {
  const segs = getSegments(ctx);

  // /api
  if (segs.length === 0) return apiOverview();

  // /api/user/...
  if (segs[0] === 'user') {
    if (segs[1] === 'me' && segs.length === 2) {
      return NextResponse.json({ email: 'user@example.com', name: 'Example User' });
    }
    return jsonNotFound();
  }

  // /api/recipe/...
  if (segs[0] === 'recipe') {
    // /api/recipe/recipes/
    if (segs[1] === 'recipes' && segs.length === 2) {
      return listRecipes();
    }

    // /api/recipe/recipes/{id}/
    if (segs[1] === 'recipes' && segs.length === 3) {
      const id = Number(segs[2]);
      return getRecipe(id);
    }

    // /api/recipe/ingredients/
    if (segs[1] === 'ingredients' && segs.length === 2) {
      return listIngredients();
    }

    // /api/recipe/tags/
    if (segs[1] === 'tags' && segs.length === 2) {
      return listTags();
    }

    return jsonNotFound();
  }

  return jsonNotFound();
}

export async function POST(req, ctx) {
  const segs = getSegments(ctx);

  // /api/user/create/
  if (segs[0] === 'user' && segs[1] === 'create' && segs.length === 2) {
    const body = await req.json().catch(() => null);
    const email = body?.email;
    const password = body?.password;
    const name = body?.name;

    if (!email || !password || !name) {
      return NextResponse.json({ detail: 'email, password, and name are required' }, { status: 400 });
    }

    const db = openDb();
    try {
      await runAsync(db, 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, password, name]);
      return NextResponse.json({ email, name }, { status: 201 });
    } catch (err) {
      if (typeof err?.message === 'string' && err.message.includes('UNIQUE')) {
        return NextResponse.json({ detail: 'Email already exists' }, { status: 409 });
      }
      throw err;
    } finally {
      db.close();
    }
  }

  // /api/user/token/
  if (segs[0] === 'user' && segs[1] === 'token' && segs.length === 2) {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ email: body.email, password: body.password });
  }

  // /api/recipe/recipes/ (create - stub)
  if (segs[0] === 'recipe' && segs[1] === 'recipes' && segs.length === 2) {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json(
      {
        id: 1,
        title: body.title,
        time_minutes: body.time_minutes,
        price: body.price,
        link: body.link ?? '',
        tags: body.tags ?? [],
        ingredients: body.ingredients ?? [],
        description: body.description ?? '',
      },
      { status: 201 }
    );
  }

  // /api/recipe/recipes/{id}/upload-image/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'recipes' && segs.length === 4 && segs[3] === 'upload-image') {
    const id = Number(segs[2]);
    return NextResponse.json({ id, image: 'http://example.com/image.jpg' });
  }

  return jsonNotFound();
}

export async function PUT(req, ctx) {
  const segs = getSegments(ctx);

  // /api/user/me/
  if (segs[0] === 'user' && segs[1] === 'me' && segs.length === 2) {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ email: body.email, name: body.name });
  }

  // /api/recipe/recipes/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'recipes' && segs.length === 3) {
    const id = Number(segs[2]);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      id,
      title: body.title,
      time_minutes: body.time_minutes,
      price: body.price,
      link: body.link ?? '',
      tags: body.tags ?? [],
      ingredients: body.ingredients ?? [],
      description: body.description ?? '',
    });
  }

  // /api/recipe/ingredients/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'ingredients' && segs.length === 3) {
    const id = Number(segs[2]);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ id, name: body.name });
  }

  // /api/recipe/tags/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'tags' && segs.length === 3) {
    const id = Number(segs[2]);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ id, name: body.name });
  }

  return jsonNotFound();
}

export async function PATCH(req, ctx) {
  const segs = getSegments(ctx);

  // /api/user/me/
  if (segs[0] === 'user' && segs[1] === 'me' && segs.length === 2) {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      email: body.email ?? 'user@example.com',
      name: body.name ?? 'Example User',
    });
  }

  // /api/recipe/recipes/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'recipes' && segs.length === 3) {
    const id = Number(segs[2]);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      id,
      title: body.title ?? 'Sample Recipe',
      time_minutes: body.time_minutes ?? 30,
      price: body.price ?? '10.00',
      link: body.link ?? '',
      tags: body.tags ?? [],
      ingredients: body.ingredients ?? [],
      description: body.description ?? '',
    });
  }

  // /api/recipe/ingredients/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'ingredients' && segs.length === 3) {
    const id = Number(segs[2]);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ id, name: body.name ?? 'Sample Ingredient' });
  }

  // /api/recipe/tags/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'tags' && segs.length === 3) {
    const id = Number(segs[2]);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ id, name: body.name ?? 'Sample Tag' });
  }

  return jsonNotFound();
}

export async function DELETE(_req, ctx) {
  const segs = getSegments(ctx);

  // /api/recipe/recipes/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'recipes' && segs.length === 3) {
    return new NextResponse(null, { status: 204 });
  }

  // /api/recipe/ingredients/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'ingredients' && segs.length === 3) {
    return new NextResponse(null, { status: 204 });
  }

  // /api/recipe/tags/{id}/ (stub)
  if (segs[0] === 'recipe' && segs[1] === 'tags' && segs.length === 3) {
    return new NextResponse(null, { status: 204 });
  }

  // If someone hits a valid path with wrong method, respond 405 for clarity.
  if (segs.length === 0) return jsonMethodNotAllowed();

  return jsonNotFound();
}

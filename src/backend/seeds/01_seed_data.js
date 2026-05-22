exports.seed = async function seed(knex) {
  await knex('users')
    .insert({
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password_123',
      name: 'Test User'
    })
    .onConflict('id')
    .ignore();

  await knex('ingredients')
    .insert([
      { id: 1, name: 'Tomatoes', unit: 'kg', category: 'Vegetables' },
      { id: 2, name: 'Garlic', unit: 'cloves', category: 'Vegetables' },
      { id: 3, name: 'Olive Oil', unit: 'ml', category: 'Oils' },
      { id: 4, name: 'Pasta', unit: 'g', category: 'Grains' },
      { id: 5, name: 'Basil', unit: 'g', category: 'Herbs' }
    ])
    .onConflict('id')
    .ignore();

  await knex('tags')
    .insert([
      { id: 1, name: 'Italian' },
      { id: 2, name: 'Vegetarian' },
      { id: 3, name: 'Quick' },
      { id: 4, name: 'Dinner' }
    ])
    .onConflict('id')
    .ignore();

  await knex('recipes')
    .insert([
      {
        id: 1,
        title: 'Simple Pasta Tomato',
        description:
          'Step 1: Boil pasta in salted water.\n\nStep 2: Heat olive oil in a pan.\n\nStep 3: Add garlic and tomatoes.\n\nStep 4: Simmer for 10 minutes.\n\nStep 5: Combine pasta with sauce.\n\nStep 6: Serve with fresh basil.',
        time_minutes: 25,
        price: '8.50',
        link: ''
      },
      {
        id: 2,
        title: 'Garlic Pasta Aglio e Olio',
        description:
          'Step 1: Cook pasta until al dente.\n\nStep 2: Slice garlic thinly.\n\nStep 3: Heat olive oil in pan.\n\nStep 4: Add garlic, cook until golden.\n\nStep 5: Toss hot pasta with oil and garlic.\n\nStep 6: Season with salt and pepper.',
        time_minutes: 15,
        price: '5.00',
        link: ''
      }
    ])
    .onConflict('id')
    .ignore();

  await knex('recipe_tags')
    .insert([
      { recipe_id: 1, tag_id: 1 },
      { recipe_id: 1, tag_id: 2 },
      { recipe_id: 1, tag_id: 4 },
      { recipe_id: 2, tag_id: 1 },
      { recipe_id: 2, tag_id: 2 },
      { recipe_id: 2, tag_id: 3 }
    ])
    .onConflict(['recipe_id', 'tag_id'])
    .ignore();

  await knex('recipe_ingredients')
    .insert([
      { recipe_id: 1, ingredient_id: 1, amount: '400', unit: 'g' },
      { recipe_id: 1, ingredient_id: 2, amount: '3', unit: 'cloves' },
      { recipe_id: 1, ingredient_id: 3, amount: '50', unit: 'ml' },
      { recipe_id: 1, ingredient_id: 4, amount: '400', unit: 'g' },
      { recipe_id: 1, ingredient_id: 5, amount: '10', unit: 'g' },
      { recipe_id: 2, ingredient_id: 4, amount: '400', unit: 'g' },
      { recipe_id: 2, ingredient_id: 2, amount: '5', unit: 'cloves' },
      { recipe_id: 2, ingredient_id: 3, amount: '100', unit: 'ml' }
    ])
    .onConflict(['recipe_id', 'ingredient_id'])
    .ignore();
};

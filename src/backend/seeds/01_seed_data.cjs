const recipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    description:
      'Step 1: Bring a large pot of salted water to boil and cook 400g spaghetti according to package directions.\n\nStep 2: While pasta cooks, cut 200g pancetta into small cubes and fry in a large pan over medium heat until crispy (about 5 minutes).\n\nStep 3: In a bowl, whisk together 4 large eggs, 100g grated Parmesan cheese, and plenty of black pepper.\n\nStep 4: When pasta is ready, reserve 1 cup of pasta water, then drain the pasta.\n\nStep 5: Remove the pan with pancetta from heat. Add the hot pasta to the pan and toss.\n\nStep 6: Pour the egg mixture over the pasta and toss quickly. The heat from the pasta will cook the eggs. Add pasta water bit by bit if needed to create a creamy sauce.\n\nStep 7: Serve immediately with extra Parmesan cheese and black pepper.',
    time_minutes: 25,
    price: '12.50',
    link: 'http://example.com/carbonara'
  },
  {
    id: 2,
    title: 'Chicken Parmesan',
    description:
      'Step 1: Preheat oven to 200C (400F).\n\nStep 2: Place 2 chicken breasts between plastic wrap and pound to 2cm thickness.\n\nStep 3: Set up breading station: flour in one plate, 2 beaten eggs in another, and 150g breadcrumbs mixed with 50g Parmesan in a third.\n\nStep 4: Season chicken with salt and pepper, then coat in flour, dip in egg, and press into breadcrumb mixture.\n\nStep 5: Heat 3 tablespoons olive oil in a large oven-safe skillet over medium-high heat. Fry chicken until golden brown, about 4 minutes per side.\n\nStep 6: Pour 300ml tomato sauce over the chicken, then top each breast with 100g sliced mozzarella.\n\nStep 7: Transfer skillet to oven and bake for 15-20 minutes until cheese is melted and bubbly.\n\nStep 8: Garnish with fresh basil and serve with pasta or salad.',
    time_minutes: 50,
    price: '18.00',
    link: 'http://example.com/chicken-parm'
  },
  {
    id: 3,
    title: 'Pasta Primavera',
    description:
      'Step 1: Cook 350g penne pasta in salted boiling water according to package directions. Reserve 1 cup pasta water before draining.\n\nStep 2: While pasta cooks, chop 1 red bell pepper, 1 zucchini into bite-sized pieces, and halve 200g cherry tomatoes.\n\nStep 3: Heat 3 tablespoons olive oil in a large pan over medium-high heat. Add 3 minced garlic cloves and cook for 30 seconds.\n\nStep 4: Add bell peppers and zucchini to the pan. Cook for 5-7 minutes until vegetables are tender.\n\nStep 5: Add cherry tomatoes and cook for another 2-3 minutes until they start to soften.\n\nStep 6: Add the drained pasta to the pan with vegetables. Toss everything together, adding pasta water as needed to create a light sauce.\n\nStep 7: Season with salt and black pepper. Remove from heat and stir in fresh basil leaves.\n\nStep 8: Serve hot with grated Parmesan cheese on top.',
    time_minutes: 30,
    price: '10.00',
    link: 'http://example.com/primavera'
  },
  {
    id: 4,
    title: 'Garlic Butter Salmon',
    description:
      'Step 1: Pat 4 salmon fillets (150g each) dry with paper towels and season both sides with salt and pepper.\n\nStep 2: Heat 2 tablespoons olive oil in a large skillet over medium-high heat.\n\nStep 3: Place salmon fillets skin-side up in the pan. Cook for 4-5 minutes until golden brown.\n\nStep 4: Flip the salmon and cook for another 3-4 minutes.\n\nStep 5: Reduce heat to medium and add 3 tablespoons butter, 4 minced garlic cloves, and juice of 1 lemon to the pan.\n\nStep 6: Spoon the garlic butter sauce over the salmon repeatedly for 1-2 minutes.\n\nStep 7: Remove from heat and sprinkle with fresh dill.\n\nStep 8: Serve immediately with the pan sauce, accompanied by rice or vegetables.',
    time_minutes: 20,
    price: '22.00',
    link: 'http://example.com/salmon'
  }
];

const ingredients = [
  { id: 1, name: 'Spaghetti', unit: null, category: null },
  { id: 2, name: 'Eggs', unit: null, category: null },
  { id: 3, name: 'Pancetta', unit: null, category: null },
  { id: 4, name: 'Parmesan Cheese', unit: null, category: null },
  { id: 5, name: 'Black Pepper', unit: null, category: null },
  { id: 6, name: 'Salt', unit: null, category: null },
  { id: 7, name: 'Chicken Breast', unit: null, category: null },
  { id: 8, name: 'Breadcrumbs', unit: null, category: null },
  { id: 9, name: 'Mozzarella Cheese', unit: null, category: null },
  { id: 10, name: 'Tomato Sauce', unit: null, category: null },
  { id: 11, name: 'Olive Oil', unit: null, category: null },
  { id: 12, name: 'Garlic', unit: null, category: null },
  { id: 13, name: 'Penne Pasta', unit: null, category: null },
  { id: 14, name: 'Bell Peppers', unit: null, category: null },
  { id: 15, name: 'Zucchini', unit: null, category: null },
  { id: 16, name: 'Cherry Tomatoes', unit: null, category: null },
  { id: 17, name: 'Basil', unit: null, category: null },
  { id: 18, name: 'Butter', unit: null, category: null },
  { id: 19, name: 'Flour', unit: null, category: null },
  { id: 20, name: 'Salmon Fillet', unit: null, category: null },
  { id: 21, name: 'Lemon', unit: null, category: null },
  { id: 22, name: 'Dill', unit: null, category: null }
];

const tags = [
  { id: 1, name: 'Italian' },
  { id: 2, name: 'Quick' },
  { id: 3, name: 'Dinner' },
  { id: 4, name: 'Vegetarian' },
  { id: 5, name: 'Healthy' },
  { id: 6, name: 'Seafood' }
];

const recipeIngredients = [
  { recipe_id: 1, ingredient_id: 1, amount: '400', unit: 'g' },
  { recipe_id: 1, ingredient_id: 2, amount: '4', unit: 'large' },
  { recipe_id: 1, ingredient_id: 3, amount: '200', unit: 'g' },
  { recipe_id: 1, ingredient_id: 4, amount: '100', unit: 'g' },
  { recipe_id: 1, ingredient_id: 5, amount: '1', unit: 'tsp' },
  { recipe_id: 1, ingredient_id: 6, amount: '1', unit: 'tsp' },
  { recipe_id: 2, ingredient_id: 7, amount: '2', unit: 'pieces' },
  { recipe_id: 2, ingredient_id: 8, amount: '150', unit: 'g' },
  { recipe_id: 2, ingredient_id: 9, amount: '100', unit: 'g' },
  { recipe_id: 2, ingredient_id: 10, amount: '300', unit: 'ml' },
  { recipe_id: 2, ingredient_id: 11, amount: '3', unit: 'tbsp' },
  { recipe_id: 2, ingredient_id: 4, amount: '50', unit: 'g' },
  { recipe_id: 2, ingredient_id: 2, amount: '2', unit: 'large' },
  { recipe_id: 2, ingredient_id: 19, amount: '100', unit: 'g' },
  { recipe_id: 2, ingredient_id: 17, amount: '10', unit: 'leaves' },
  { recipe_id: 3, ingredient_id: 13, amount: '350', unit: 'g' },
  { recipe_id: 3, ingredient_id: 14, amount: '1', unit: 'piece' },
  { recipe_id: 3, ingredient_id: 15, amount: '1', unit: 'piece' },
  { recipe_id: 3, ingredient_id: 16, amount: '200', unit: 'g' },
  { recipe_id: 3, ingredient_id: 12, amount: '3', unit: 'cloves' },
  { recipe_id: 3, ingredient_id: 11, amount: '3', unit: 'tbsp' },
  { recipe_id: 3, ingredient_id: 17, amount: '15', unit: 'leaves' },
  { recipe_id: 3, ingredient_id: 4, amount: '50', unit: 'g' },
  { recipe_id: 4, ingredient_id: 20, amount: '4', unit: 'fillets' },
  { recipe_id: 4, ingredient_id: 18, amount: '3', unit: 'tbsp' },
  { recipe_id: 4, ingredient_id: 12, amount: '4', unit: 'cloves' },
  { recipe_id: 4, ingredient_id: 21, amount: '1', unit: 'piece' },
  { recipe_id: 4, ingredient_id: 22, amount: '2', unit: 'tbsp' },
  { recipe_id: 4, ingredient_id: 11, amount: '2', unit: 'tbsp' }
];

const recipeTags = [
  { recipe_id: 1, tag_id: 1 },
  { recipe_id: 1, tag_id: 3 },
  { recipe_id: 2, tag_id: 1 },
  { recipe_id: 2, tag_id: 3 },
  { recipe_id: 3, tag_id: 1 },
  { recipe_id: 3, tag_id: 2 },
  { recipe_id: 3, tag_id: 4 },
  { recipe_id: 3, tag_id: 5 },
  { recipe_id: 4, tag_id: 2 },
  { recipe_id: 4, tag_id: 3 },
  { recipe_id: 4, tag_id: 5 },
  { recipe_id: 4, tag_id: 6 }
];

async function resetSequence(knex, tableName) {
  await knex.raw(
    `SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), COALESCE((SELECT MAX(id) FROM ${tableName}), 1), (SELECT COUNT(*) > 0 FROM ${tableName}))`
  );
}

exports.seed = async function seed(knex) {
  await knex.transaction(async trx => {
    await trx('recipe_tags').del();
    await trx('recipe_ingredients').del();

    await trx('users')
      .insert({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password_123',
        name: 'Test User'
      })
      .onConflict('id')
      .merge(['email', 'password', 'name']);

    await trx('ingredients')
      .insert(ingredients)
      .onConflict('id')
      .merge(['name', 'unit', 'category']);

    await trx('tags')
      .insert(tags)
      .onConflict('id')
      .merge(['name']);

    await trx('recipes')
      .insert(recipes)
      .onConflict('id')
      .merge(['title', 'description', 'time_minutes', 'price', 'link']);

    await trx('recipe_tags')
      .insert(recipeTags)
      .onConflict(['recipe_id', 'tag_id'])
      .ignore();

    await trx('recipe_ingredients')
      .insert(recipeIngredients)
      .onConflict(['recipe_id', 'ingredient_id'])
      .merge(['amount', 'unit']);

    for (const tableName of ['users', 'recipes', 'ingredients', 'tags']) {
      await resetSequence(trx, tableName);
    }
  });
};

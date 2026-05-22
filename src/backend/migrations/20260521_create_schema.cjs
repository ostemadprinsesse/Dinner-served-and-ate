exports.up = async function up(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('name').notNullable();
  });

  await knex.schema.createTable('recipes', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.integer('time_minutes');
    table.decimal('price', 10, 2);
    table.text('link');
  });

  await knex.schema.createTable('ingredients', table => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.string('unit');
    table.string('category');
  });

  await knex.schema.createTable('tags', table => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
  });

  await knex.schema.createTable('recipe_ingredients', table => {
    table.increments('id').primary();
    table.integer('recipe_id').notNullable().references('id').inTable('recipes').onDelete('CASCADE');
    table.integer('ingredient_id').notNullable().references('id').inTable('ingredients').onDelete('CASCADE');
    table.string('amount');
    table.string('unit');
    table.unique(['recipe_id', 'ingredient_id']);
  });

  await knex.schema.createTable('recipe_tags', table => {
    table.increments('id').primary();
    table.integer('recipe_id').notNullable().references('id').inTable('recipes').onDelete('CASCADE');
    table.integer('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE');
    table.unique(['recipe_id', 'tag_id']);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('recipe_tags');
  await knex.schema.dropTableIfExists('recipe_ingredients');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('ingredients');
  await knex.schema.dropTableIfExists('recipes');
  await knex.schema.dropTableIfExists('users');
};

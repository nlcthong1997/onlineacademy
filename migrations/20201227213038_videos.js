
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('videos', (table) => {
      table.increments('id').primary();
      table.integer('courses_id').notNull();
      table.integer('rank').defaultTo(1).notNull();
      table.string('name', 500).notNull();
      table.text('url').nullable();
      table.integer('views').defaultTo(0).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('videos');
};

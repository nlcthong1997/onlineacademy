
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('slides', (table) => {
      table.increments('id').primary();
      table.integer('courses_id').notNull();
      table.string('name', 500).notNull();
      table.text('url').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('slides');
};

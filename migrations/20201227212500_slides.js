
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('slides', (table) => {
      table.increments('id').primary();
      table.json('urls').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('slides');
};


exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('categories', function (table) {
      table.increments('id').primary();
      table.string('name', 300).notNull();
      table.string('search_name', 300).notNull()
      table.index('search_name', 'search_name', 'FULLTEXT');
      table.string('img', 260).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('categories');
};

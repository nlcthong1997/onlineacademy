
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('videos', function (table) {
      table.increments('id').primary();
      table.json('urls').nullable();
      table.integer('views').defaultTo(0).nullable()
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('videos');
};

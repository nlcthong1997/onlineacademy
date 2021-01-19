
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('code_mail', (table) => {
      table.increments('id').primary();
      table.string('code').notNull();
      table.boolean('is_available').defaultTo(true).notNull();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('code_mail');
};

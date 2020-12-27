
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('username', 255).notNull();
      table.string('password', 255).notNull();
      table.string('email').unique().notNull();
      table.enu('role', ['admin', 'user']).defaultTo('user').notNull();
      table.string('full_name', 500).nullable();
      table.text('refresh_token').nullable();
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('users');
};

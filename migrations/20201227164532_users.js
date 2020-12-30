
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username', 255).notNull();
      table.string('password', 255).notNull();
      table.string('email').unique().notNull();
      table.enu('role', ['admin', 'teacher', 'user']).defaultTo('user').notNull();
      table.string('full_name', 500).nullable();
      table.text('refresh_token').nullable();
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('users');
};

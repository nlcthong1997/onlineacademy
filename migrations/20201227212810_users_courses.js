
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('users_courses', function (table) {
      table.increments('id').primary();
      table.integer('users_id').notNull();
      table.integer('courses_id').notNull();
      table.integer('process_courses_id').notNull();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('users_courses');
};

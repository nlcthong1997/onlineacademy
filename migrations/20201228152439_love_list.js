
exports.up = (knex, Promise) => {
    return knex.schema
      .createTable('love_list', (table) => {
        table.increments('id').primary();
        table.integer('courses_id').nullable();
        table.integer('users_id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
  };
  
  exports.down = (knex, Promise) => {
    return knex.schema
      .dropTable('love_list');
  };
  
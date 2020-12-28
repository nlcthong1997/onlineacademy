
exports.up = (knex, Promise) => {
    return knex.schema
      .createTable('feedbacks', (table) => {
        table.increments('id').primary();
        table.integer('courses_id').nullable();
        table.integer('users_id');
        table.text('comment');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
  };
  
  exports.down = (knex, Promise) => {
    return knex.schema
      .dropTable('feedbacks');
  };
  
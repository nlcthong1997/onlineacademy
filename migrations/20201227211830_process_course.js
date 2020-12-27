
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('process_course', function (table) {
      table.increments('id').primary();
      table.enu('status', ['prepare', 'learning', 'completed']).defaultTo('prepare').notNull();
      table.string('current_url_unit_video', 260).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('process_course');
};


exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('courses', (table) => {
      table.increments('id').primary();
      table.integer('categories_id').notNull();
      table.string('title', 255).notNull();
      table.string('name', 300).notNull();
      table.string('search_name', 300).notNull()
      table.index('search_name', 'search_name', 'FULLTEXT');
      table.string('teacher', 300).notNull();
      table.integer('point_evaluate').nullable();
      table.integer('qty_student_evaluate').nullable();
      table.integer('qty_student_registed').nullable();
      table.string('img', 260).nullable();
      table.string('img_large', 260).nullable();
      table.decimal('price', 10, 2).defaultTo(0).notNull();
      table.decimal('price_promo', 10, 2).defaultTo(0).notNull();
      table.string('sort_desc', 350).nullable();
      table.text('detail_desc').nullable();
      table.text('html_desc').nullable();
      table.text('draft_desc').nullable();
      table.enu('status', ['completed', 'pending']).defaultTo('pending').notNull();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('courses');
};

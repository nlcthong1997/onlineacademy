
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('categories').insert([
        {id: 1, name: 'Lập trình web', search_name: 'lap trinh web', img: null},
        {id: 2, name: 'Lập trình di động', search_name: 'lap trinh di dong', img: null},
      ]);
    });
};


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('courses').del()
    .then(function () {
      // Inserts seed entries
      return knex('courses').insert([
        {
          id: 1, 
          categories_id: 1, 
          title: 'KHÓA HỌC LẬP TRÌNH CHO NGƯỜI MỚI BẮT ĐẦU', 
          name: 'Lập trình PHP',
          search_name: 'lap trinh php',
          teacher: 'Nguyễn Văn A',
          point_evaluate: 400,
          qty_student_evaluate: 30,
          qty_student_registed: 20,
          price: 3000000,
          detail_desc: 'Khóa học dành cho những bạn có mong muốn sau khi học xong sẽ tìm được một công việc ổn định với mức thu nhập hấp dẫn'
        },
        {
          id: 2, 
          categories_id: 1, 
          title: 'KHÓA HỌC LẬP TRÌNH CHO SINH VIÊN', 
          name: 'Lập trình Nodejs',
          search_name: 'lap trinh nodejs',
          teacher: 'Nguyễn Văn B',
          point_evaluate: 420,
          qty_student_evaluate: 35,
          qty_student_registed: 26,
          price: 3500000,
          detail_desc: 'Khóa học dành cho những bạn có mong muốn sau khi học xong sẽ tìm được một công việc ổn định với mức thu nhập hấp dẫn'
        },
        {
          id: 3, 
          categories_id: 2, 
          title: 'KHÓA HỌC LẬP TRÌNH NÂNG CA0', 
          name: 'Lập trình IOS',
          search_name: 'lap trinh ios',
          teacher: 'Nguyễn Văn C',
          point_evaluate: 412,
          qty_student_evaluate: 31,
          qty_student_registed: 22,
          price: 4500000,
          detail_desc: 'Khóa học dành cho những bạn có mong muốn sau khi học xong sẽ tìm được một công việc ổn định với mức thu nhập hấp dẫn'
        },
        {
          id: 4, 
          categories_id: 2, 
          title: 'KHÓA HỌC LẬP DI ĐỘNG CHO NGƯỜI MỚI', 
          name: 'Lập trình Android',
          search_name: 'lap trinh android',
          teacher: 'Nguyễn Văn D',
          point_evaluate: 319,
          qty_student_evaluate: 10,
          qty_student_registed: 9,
          price: 41000000,
          detail_desc: 'Khóa học dành cho những bạn có mong muốn sau khi học xong sẽ tìm được một công việc ổn định với mức thu nhập hấp dẫn'
        },
      ]);
    });
};

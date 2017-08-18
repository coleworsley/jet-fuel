
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', function(table) {
      table.increments('id').primary();
      table.string('name').unique();
    }),

    knex.schema.createTable('links', function(table) {
      table.increments('id').primary();
      table.string('original_url');
      table.string('short_url');
      table.integer('folder_id').unsigned();
      table.foreign('folder_id').references('folders.id')
      table.timestamps(true, true);

    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('links'),
    knex.schema.dropTable('folders')
  ])
};

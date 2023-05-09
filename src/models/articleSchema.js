const knex = require("./dbConnection");


module.exports = knex.schema.hasTable('Articles').then( (exists) => {
    if (!exists) {
        return knex.schema.createTable('Articles', t => {
            t.increments('id').primary()
            t.string('title', TEXT).notNullable()
            t.string('content', TEXT).notNullable()
            t.string('view_count', 9999).notNullable()
            t.datetime('created_at')
            t.datetime('updated_at')
            t.datetime('deleted_at')
        });
    }
});

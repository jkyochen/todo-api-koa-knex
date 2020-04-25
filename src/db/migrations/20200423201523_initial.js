const tableNames = require("../../constants/tableNames");
const {
    addDefaultColumns,
    references,
} = require("../../lib/tableUtils");

exports.up = async (knex) => {
    await knex.schema.createTable(tableNames.user, (table) => {
        table.increments().notNullable();
        table.string("username", 127).notNullable().unique();
        table.string("password", 127).notNullable();
        table.string("role", 32).notNullable();
        addDefaultColumns(table);
    });

    await knex.schema.createTable(tableNames.todo, (table) => {
        table.increments().notNullable();
        table.string("title", 127).notNullable();
        table.string("content", 1000);
        addDefaultColumns(table);
        references(table, "user");
    });
};

exports.down = async (knex) => {
    await Promise.all(
        [tableNames.user, tableNames.todo]
            .reverse()
            .map((name) => knex.schema.dropTableIfExists(name))
    );
};

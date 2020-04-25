const bcrypt = require("bcrypt");
const Knex = require("knex");

const tableNames = require("../../constants/tableNames");

exports.seed = async (knex) => {
    const [user_id] = await knex(tableNames.user).insert({
        username: "John",
        password: await bcrypt.hash("ChangeMe", 12),
        role: "admin",
    });
    console.log("User created:", user_id);

    const todo_id = await knex(tableNames.todo).insert({
        title: "明天早起",
        content: "起床跑步",
        user_id: user_id,
    });
    console.log("Todo created:", todo_id);
};

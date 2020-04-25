const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Knex = require("knex");

const tableNames = require("../../constants/tableNames");

exports.seed = async (knex) => {
    const password = crypto.randomBytes(15).toString("hex");

    const user = {
        username: "LAN",
        password: await bcrypt.hash(password, 12),
        role: "admin",
    };

    const [user_id] = await knex(tableNames.user).insert(user);

    console.log(
        "User created:",
        {
            password,
        },
        user_id
    );

    const todo = {
        title: "明天早起",
        content: "起床跑步",
        user_id: user_id,
    };

    const todo_id = await knex(tableNames.todo).insert(todo);

    console.log("Todo created:", todo_id);
};

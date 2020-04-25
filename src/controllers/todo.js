const Todo = require("../models/Todo");

module.exports = {
    List: async (ctx) => {
        const user_id = ctx.req.user.id;
        const posts = await Todo.query().where({ user_id });
        ctx.status = 200;
        ctx.body = {
            data: posts,
        };
    },
    Create: async (ctx) => {
        const user_id = ctx.req.user.id;
        const { title, content } = ctx.request.body;
        const post = await Todo.query().insert({ title, content, user_id });
        ctx.status = 200;
        ctx.body = { data: post };
    },
    Patch: async (ctx) => {
        const { id } = ctx.params;
        const { title, content } = ctx.request.body;
        if (!(await Todo.query().patch({ title, content }).where({ id }))) {
            ctx.throw(409, { data: { message: "Conflict patch todo." } });
        }
        ctx.status = 200;
        ctx.body = {
            data: { title, content },
        };
    },
    Delete: async (ctx) => {
        const { id } = ctx.params;
        if (!(await Todo.query().delete().where({ id }))) {
            ctx.throw(409, { data: { message: "Conflict delete todo." } });
        }
        ctx.status = 200;
        ctx.body = {
            data: "success",
        };
    },
};

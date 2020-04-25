const { chai, app, knex } = require(".");

describe("Routes: todos", () => {
    beforeAll(async () => {
        await knex.migrate.rollback();
        await knex.migrate.latest();
        await knex.seed.run();
    });

    afterAll(async () => {
        await knex.migrate.rollback();
    });

    describe("GET /api/v1/todos", () => {
        test("Should return array of todos", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            res = await agent.get("/api/v1/todos");
            agent.close();
            expect(res.status).toEqual(200);
            expect(res.body.data).toBeDefined();
        });

        test("Should return error when user not login", async () => {
            const res = await chai.request(app).get("/api/v1/todos");
            expect(res.status).toEqual(401);
            expect(res.body.error.message).toEqual("Unauthorized login user");
        });
    });

    describe("POST /api/v1/todos", () => {
        test("Should return single post after insert", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            res = await agent
                .post("/api/v1/todos")
                .send({ title: "study rust", content: "first chapter" });
            agent.close();
            expect(res.status).toEqual(200);
            expect(res.body.data).toBeDefined();
        });

        test("Should return error status, message, when body invalid", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            res = await agent
                .post("/api/v1/todos")
                .send({ title: "", content: "" });
            agent.close();
            expect(res.status).toEqual(400);
            expect(res.body.error.title[0].keyword).toEqual("minLength");
            expect(res.body.error.content[0].keyword).toEqual("minLength");
        });

        test("Should return error when user not login", async () => {
            const res = await chai.request(app).post("/api/v1/todos");
            expect(res.status).toEqual(401);
            expect(res.body.error.message).toEqual("Unauthorized login user");
        });
    });

    describe("PATCH /api/v1/todos", () => {
        test("Should return patched entity", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            const todos = await agent.get("/api/v1/todos");
            const [first] = todos.body.data;
            res = await agent
                .patch(`/api/v1/todos/${first.id}`)
                .send({ title: "study golang", content: "second chapter" });
            agent.close();
            expect(res.status).toEqual(200);
            expect(res.body.data).toBeDefined();
        });

        test("Should return error status, message, when body invalid", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            const todos = await agent.get("/api/v1/todos");
            const [first] = todos.body.data;
            res = await agent
                .patch(`/api/v1/todos/${first.id}`)
                .send({ title: "", content: "" });
            agent.close();
            expect(res.status).toEqual(400);
            expect(res.body.error.title[0].keyword).toEqual("minLength");
            expect(res.body.error.content[0].keyword).toEqual("minLength");
        });

        test("Should return error, when todo id invalid", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            res = await agent
                .patch(`/api/v1/todos/100`)
                .send({ title: "study golang", content: "second chapter" });
            agent.close();
            expect(res.status).toEqual(409);
            expect(res.body.error.message).toEqual("Conflict patch todo.");
        });

        test("Should return error when user not login", async () => {
            const res = await chai.request(app).patch(`/api/v1/todos/100`);
            expect(res.status).toEqual(401);
            expect(res.body.error.message).toEqual("Unauthorized login user");
        });
    });

    describe("DELETE /api/v1/todos", () => {
        test("Should return success", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            const todos = await agent.get("/api/v1/todos");
            const [first] = todos.body.data;
            res = await agent
                .delete(`/api/v1/todos/${first.id}`)
                .send({ title: "study golang", content: "second chapter" });
            agent.close();
            expect(res.status).toEqual(200);
            expect(res.body.data).toEqual("success");
        });

        test("Should return error, when todo id invalid", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            res = await agent
                .delete(`/api/v1/todos/100`)
                .send({ title: "study golang", content: "second chapter" });
            agent.close();
            expect(res.status).toEqual(409);
            expect(res.body.error.message).toEqual("Conflict delete todo.");
        });

        test("Should return error when user not login", async () => {
            const res = await chai.request(app).delete(`/api/v1/todos/100`);
            expect(res.status).toEqual(401);
            expect(res.body.error.message).toEqual("Unauthorized login user");
        });
    });
});

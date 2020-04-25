const { chai, app, knex } = require('.');

describe("Routes: users", () => {
    beforeAll(async () => {
        await knex.migrate.rollback();
        await knex.migrate.latest();
        await knex.seed.run();
    });

    afterAll(async () => {
        await knex.migrate.rollback();
    });

    describe("POST /api/v1/users/register", () => {
        test("Should return single user after register", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/register")
                .send({ username: "Kitty", password: "ChangeMe" });
            expect(res.status).toEqual(200);
            expect(res.body.data.id).toEqual(2);
        });

        test("Should return exist error after register same username", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/register")
                .send({ username: "Kitty", password: "ChangeMe" });
            expect(res.status).toEqual(409);
            expect(res.body.error.message).toEqual("Conflict regsiter user");
        });

        test("Should return error status, message, when body invalid", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/register")
                .send({ username: "", password: "" });
            expect(res.status).toEqual(400);
            expect(res.body.error.username[0].keyword).toEqual("minLength");
        });
    });

    describe("POST /api/v1/users/login", () => {
        test("Should return single user after login", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/login")
                .send({ username: "Kitty", password: "ChangeMe" });
            expect(res.status).toEqual(200);
            expect(res.body.data.id).toEqual(2);
            expect(res.header["set-cookie"]).toBeDefined();
        });

        test("Should return error status, message, when body invalid", async () => {
            const res = await chai
                .request(app)
                .post("/api/v1/users/login")
                .send({ username: "", password: "" });
            expect(res.status).toEqual(401);
            expect(res.body.error.message).toEqual("Unauthorized login user");
        });
    });

    describe("GET /api/v1/users/logout", () => {
        test("Should return success after logout", async () => {
            const agent = chai.request.agent(app);
            let res = await agent
                .post("/api/v1/users/login")
                .send({ username: "John", password: "ChangeMe" });
            expect(res.header["set-cookie"]).toBeDefined();
            res = await agent.get("/api/v1/users/logout");
            expect(res.status).toEqual(200);
            expect(res.body.data.message).toEqual("Logout Success");
            agent.close();
        });

        test("Should return error after logout not login", async () => {
            const res = await chai.request(app).get("/api/v1/users/logout");
            expect(res.status).toEqual(401);
            expect(res.body.error.message).toEqual("Unauthorized login user");
        });
    });
});

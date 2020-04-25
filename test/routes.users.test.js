process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../src/app").callback();
const knex = require("../src/db/config");

describe("Routes: users", () => {
    beforeAll(() => {
        return knex.migrate
            .rollback()
            .then(() => knex.migrate.latest())
            .then(() => knex.seed.run());
    });

    afterAll(() => {
        return knex.migrate.rollback();
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
});

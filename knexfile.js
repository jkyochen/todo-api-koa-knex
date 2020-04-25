require("dotenv").config();

module.exports = {
    test: {
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: `${process.env.MYSQL_PASSWORD}`,
            database: `${process.env.MYSQL_DB}_test`
        },
        migrations: {
            directory: "./src/db/migrations",
        },
        seeds: {
            directory: "./src/db/seeds",
        },
    },
    development: {
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: `${process.env.MYSQL_PASSWORD}`,
            database: `${process.env.MYSQL_DB}`
        },
        migrations: {
            directory: "./src/db/migrations",
        },
        seeds: {
            directory: "./src/db/seeds",
        },
    },
};

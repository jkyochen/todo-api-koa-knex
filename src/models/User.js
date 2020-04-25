const Model = require("./Model");
const _ = require("lodash");

class User extends Model {
    static get tableName() {
        return "user";
    }

    static get relationMappings() {
        const Todo = require("./Todo");
        return {
            todos: {
                relation: Model.HasManyRelation,
                modelClass: Todo,
                join: {
                    from: "user.id",
                    to: "todo.user_id",
                },
            },
        };
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["username", "password", "role"],
            properties: {
                username: { type: "string", minLength: 1, maxLength: 127 },
                password: { type: "string", minLength: 1, maxLength: 127 },
                role: { type: "string", minLength: 1, maxLength: 32 },
            },
        };
    }

    $formatJson(json) {
        json = super.$formatJson(json);
        return _.omit(json, ["password"]);
    }
}

module.exports = User;

const Model = require("./Model");
const tableNames = require("../constants/tableNames");

class Todo extends Model {
    static get tableName() {
        return tableNames.todo;
    }

    static get relationMappings() {
        const User = require("./User");
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "todo.user_id",
                    to: "user.id",
                },
            },
        };
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["title"],
            properties: {
                title: { type: "string", minLength: 1, maxLength: 127 },
                content: { type: "string", minLength: 1, maxLength: 1000 },
            },
        };
    }
}

module.exports = Todo;

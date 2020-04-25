# Table

**user**

| Key |  Field   |   Type  |
|-----|----------|---------|
| PK  | id       | sereial |
|     | name     | text    |
|     | password | text    |
|     | role     | text    |

**todo**

| Key |  Field  |   Type  |
|-----|---------|---------|
| PK  | id      | sereial |
| FK  | user_id |         |
|     | title   | text    |
|     | content | text    |

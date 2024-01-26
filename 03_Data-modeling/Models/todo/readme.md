
# Models

## User Model

The User model represents users in the application. Here's a quick overview of its attributes:

- **username:** String, required, unique, and in lowercase.
- **email:** String, required, unique, and in lowercase.
- **password:** String, required, unique, and in lowercase.

## Todo Model

The Todo model represents tasks in the application. Here are its key attributes:

- **content:** String, required.
- **complete:** Boolean, default is `false`.
- **createdBy:** Object ID referencing the `User` model.
- **subTodos:** Array of Object IDs referencing `SubTodo` model.

## SubTodo Model

The SubTodo model represents subtasks within a task. It includes the following attributes:

- **content:** String, required.
- **complete:** Boolean, default is `false`.
- **createdBy:** Object ID referencing the `User` model.



`In general Modeling a generic schema with Mongoose involves defining a schema that can accommodate various types of data and then creating a Mongoose model based on that schema. Here are the steps to model a generic schema:` <br>
`1.Install Mongoose` <br>
`2.Import Mongoose` <br>
`3.Define a Generic Schema` <br>
`4.Create a Mongoose Model` <br>
`5.Export the Model` <br>



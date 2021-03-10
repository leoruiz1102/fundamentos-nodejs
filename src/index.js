const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [{
  "id": "3247c0cc-7ccf-4848-9423-e8409099e2a2",
  "name": "Leonardo Ruiz",
  "username": "leoruiz1102",
  "todos": []
}];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const verifyIfUserExist = users.find(user => {
    return user.username === username;
  })
  if (!verifyIfUserExist) {
    return response.status(404).json({
      error: 'Please, create an account first!'
    })
  }

  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  // Verify if already exist an user with this username
  const verofyIfUserExist = users.find(user => {
    return user.username === username;
  })
  if (verofyIfUserExist) {
    return response.status(400).json({
      error: 'This username already exist'
    })
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const user = users.find(user => {
    return user.username === username;
  })
  return response.status(200).json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body

  const user = users.find(user => {
    return user.username === username;
  })

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: Date.now(),
  }

  user.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const user = users.find(user => {
    return user.username === username;
  })

  const todoToUpdate = user.todos.find(todo => {
    return todo.id === id;
  })

  if (!todoToUpdate) {
    return response.status(404).json({
      error: 'Todo does not found!'
    })
  }

  todoToUpdate.title = title;
  todoToUpdate.deadline = deadline;

  return response.status(200).json(todoToUpdate)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find(user => {
    return user.username === username;
  })

  const todoToUpdate = user.todos.find(todo => {
    return todo.id === id;
  })

  if (!todoToUpdate) {
    return response.status(404).json({
      error: 'Todo does not found!'
    })
  }

  todoToUpdate.done = true;

  return response.status(200).json(todoToUpdate)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find(user => {
    return user.username === username;
  })

  const todoToDelete = user.todos.find(todo => {
    return todo.id === id;
  })

  if (!todoToDelete) {
    return response.status(404).json({
      error: 'Todo does not found!'
    })
  }

  user.todos = user.todos.filter(todo => {
    return todo.id !== id
  })

  return response.status(204).json();
});

module.exports = app;
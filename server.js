const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("./todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:4050", grpc.ServerCredentials.createInsecure());

server.addService(todoPackage.TodoService.service, {
  createTodo,
  updateTodo,
  deleteTodo,
  getAllTodos,
  streamTodos,
});

const db = {
  todoList: [],
};

server.start();

function createTodo(call, callback) {
  console.log(`---- ~ create todo call request:`, call.request);
  const text = call.request?.text || "";
  console.log("create todo call", { text });
  if (!text) callback(null, null);
  const todoItem = {
    id: db.todoList.length + 1,
    text,
  };
  console.log(`---- ~ create todoItem:`, todoItem);
  db.todoList.push(todoItem);
  callback(null, todoItem);
}

function updateTodo(call, callback) {
  const id = call.request?.id || undefined;
  const text = call.request?.text || "";
  if (!id || !text) callback(null, null);
  const todoItem = { id, text };
  const itemIndex = db.todoList.findIndex((item) => item.id === id);
  console.log(`---- ~ itemIndex:`, itemIndex);
  if (itemIndex > -1) {
    db.todoList.splice(itemIndex, 1, todoItem);
  }
  console.log(`---- ~ db.todoList:`, db.todoList);
  callback(null, todoItem);
}

function deleteTodo(call, callback) {}

function getAllTodos(call, callback) {
  callback(null, {
    todos: db.todoList,
  });
}

function streamTodos(call, callback) {
  db.todoList.forEach((item) => call.write(item));
  call.end();
}

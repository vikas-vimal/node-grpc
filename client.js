const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("./todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.TodoService(
  "localhost:4040",
  grpc.credentials.createInsecure()
);

let myTodoList = [];

client.getAllTodos({}, (err, res) => {
  myTodoList = res?.todos || [];
  console.log("getAllTodos response", myTodoList);
});

client.updateTodo(
  {
    id: myTodoList?.[1]?.id || 3,
    text: "Drink Juice",
  },
  (err, res) => {
    console.log("updateTodo response", { err, res });
  }
);

client.getAllTodos({}, (err, res) => {
  myTodoList = res?.todos || [];
  console.log("getAllTodos response", myTodoList);
});

client.createTodo(
  {
    text: "Eat Apple",
  },
  (err, res) => {
    console.log("createTodo response", { err, res });
  }
);

client.createTodo(
  {
    text: "Drink Joice",
  },
  (err, res) => {
    console.log("createTodo response", { err, res });
  }
);

client.createTodo(
  {
    text: "Eat banana",
  },
  (err, res) => {
    console.log("createTodo response", { err, res });
  }
);

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("./todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.TodoService(
  "localhost:4050",
  grpc.credentials.createInsecure()
);

const ACTION = process.argv[2] || null;
const VALUE = process.argv[3] || null;
const ID = process.argv[4] || null;
console.log(`---- ~ action : value : id :`, ACTION, VALUE, ID);

switch (ACTION) {
  case "c":
    console.log("creating todo");
    client.createTodo(
      {
        text: VALUE,
      },
      (err, res) => {
        console.log("createTodo response", { err, res });
      }
    );
    break;
  case "u":
    console.log("updating todo");
    client.updateTodo(
      {
        text: VALUE,
        id: ID,
      },
      (err, res) => {
        console.log("updateTodo response", { err, res });
      }
    );
    break;
  case "r":
    console.log("reading all todos");
    client.getAllTodos({}, (err, res) => {
      console.log("getAllTodo response", res?.todos);
    });
    break;

  default:
    console.log("no actions");
    break;
}

const streamCall = client.streamTodos();
streamCall.on("data", (item) => {
  console.log("stream received todo: ", item);
});
streamCall.on("end", (e) => console.log("stream ended"));

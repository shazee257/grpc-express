// server.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the calculator.proto file
const CALCULATOR_PROTO_PATH = path.join(__dirname, './calculator.proto');
const calculatorPackageDefinition = protoLoader.loadSync(CALCULATOR_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const calculatorProto = grpc.loadPackageDefinition(calculatorPackageDefinition).Calculator;

// Load the user.proto file
const USER_PROTO_PATH = path.join(__dirname, './user.proto');
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const userProto = grpc.loadPackageDefinition(userPackageDefinition).User;

// In-memory storage for users (for demonstration purposes)
const users = [];

// gRPC method implementation
function add(call, callback) {
    const { num1, num2 } = call.request;
    const result = num1 + num2;
    console.log('gRPC method Add called with:', { num1, num2 });
    callback(null, { result });
}

// gRPC method implementation for UserService
function createUser(call, callback) {
    const { name, email } = call.request;
    const id = String(users.length + 1); // Simple ID generation
    const user = { id, name, email };
    users.push(user);
    callback(null, user);
}

function fetchUsers(call, callback) {
    callback(null, { users });
}

// Main function to start the gRPC server
function startServer() {
    const server = new grpc.Server();
    server.addService(calculatorProto.service, { Add: add });
    server.addService(userProto.service, { CreateUser: createUser });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('gRPC server running at http://0.0.0.0:50051');
    });
}

startServer();

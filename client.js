// client.js
const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const CALCULATOR_PROTO_PATH = path.join(__dirname, './calculator.proto');
const USER_PROTO_PATH = path.join(__dirname, './user.proto');

// Load calculator.proto
const calculatorPackageDefinition = protoLoader.loadSync(CALCULATOR_PROTO_PATH);
const { Calculator } = grpc.loadPackageDefinition(calculatorPackageDefinition);

// Load user.proto
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH);
const { User } = grpc.loadPackageDefinition(userPackageDefinition);

// Create a new gRPC client
const calculatorClient = new Calculator('localhost:50051', grpc.credentials.createInsecure());
const userClient = new User('localhost:50051', grpc.credentials.createInsecure());

// Create Express.js app
const app = express();
app.use(express.json());

// HTTP route that uses gRPC client to perform addition
app.post('/add', (req, res) => {
    const { num1, num2 } = req.body;

    calculatorClient.Add({ num1, num2 }, (error, response) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ result: response.result });
    });
});

app.post('/users', (req, res) => {
    console.log('http get /users')
    const { name, email } = req.body;
    userClient.CreateUser({ name, email }, (error, response) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(response);
    });
});

// Start Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});

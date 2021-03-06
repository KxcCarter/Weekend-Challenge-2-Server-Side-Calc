const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('server/public'));

let history = [];
let solved = null;

// LOGIC //

// calculates solution and pushes a new object containing solution into history array.
function calculate(mathObject) {
    console.log('in calculate');
    let result = null;
    let mathSolved = {};

    let a, b, op;

    [a, b, op] = [mathObject.num1, mathObject.num2, mathObject.operator];

    switch (op) {
        case '+':
            result = Number(a) + Number(b);
            break;
        case '-':
            result = Number(a) - Number(b);
            break;
        case '*':
            result = Number(a) * Number(b);
            break;
        case '/':
            result = Number(a) / Number(b);
            break;
    }

    mathObject.result = result;
    mathSolved = mathObject;
    solved = mathSolved;
    history.push(mathSolved);
    return mathSolved;
} // end calculate

// GET AND POST ROUTES //

// mathObject structure
// {
//     num1: Number,
//     num2: Number,
//     operator: String,
//     result: Number
// }

app.post('/calc', (req, res) => {
    let mathObject = req.body;
    console.log(mathObject);
    calculate(mathObject);
    console.log('mathSolved pushed to history');
    res.sendStatus(201);
});

app.delete('/clearHistory', (req, res) => {
    history = [];
    res.sendStatus(200);
});

app.get('/solved', (req, res) => {
    console.log('get request recieved');
    res.send({ solved });
});

app.get('/prevCalculations', (req, res) => {
    res.send(history);
});

app.listen(PORT, () => {
    console.log('Server running on Port 5000');
});
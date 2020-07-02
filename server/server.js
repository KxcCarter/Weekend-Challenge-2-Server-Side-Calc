const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('server/public'));

const history = [];
let mathSolved = null;

// LOGIC //

// calculates solution and pushes a new object containing solution into history array.
function calculate(mathObject) {
    let result = null;

    let a,
        b,
        opp = [mathObject.num1, mathObject.num2, mathObject.opperator];

    switch (opp) {
        case opp === '+':
            result = Number(a) + Number(b);
            break;
        case opp === '-':
            result = Number(a) - Number(b);
            break;
        case opp === '*':
            result = Number(a) * Number(b);
            break;
        case opp === '/':
            result = Number(a) / Number(b);
            break;
    }
    mathObject.result = result;
    mathSolved = mathObject;
    history.push(mathSolved);
} // end calculate

// GET AND POST ROUTES //

// mathObject structure
// {
//     num1: Number,
//     num2: Number,
//     opperator: String,
//     result: Number
// }

app.post('/calc', (req, res) => {
    let mathObject = req.body;
    calculate(mathObject);
    res.sendStatus(201);
});

app.get('/solved', (req, res) => {
    res.send(mathSolved);
});

app.get('/prevCalculations', (req, res) => {
    res.send(history);
});

app.listen(PORT, () => {
    console.log('Server running on Port 5000');
});
$(document).ready(init);

let operatorInput = null;
let currentSolution = null;

let inputNum1 = [];
let inputNum2 = [];

function init() {
    console.log('js and jQuery loaded');
    $('.js-btn-operator').on('click', handleOp);
    $('.js-Calculate').on('click', performCalc);
    $('#jsClearInputs').on('click', clearInputs);
    $('#jsClearInputs').on('dblclick', clearHistory);
    $('#jsHistory').on('click', '.jsHistoricalItem', recompute);
    $('#jsKeypad').on('click', '.js-Num', handleGUI);
    renderHistory();
}

function handleOp() {
    console.log($(this).data());

    operatorInput = $(this).data('op');
}

function clearInputs() {
    $('#jsNum1').val('');
    $('#jsNum2').val('');
    operatorInput = null;
    inputNum1 = [];
    inputNum2 = [];
}

function performCalc() {
    let mathObject = {
        num1: parseInt($('#jsNum1').val()),
        num2: parseInt($('#jsNum2').val()),
        operator: operatorInput,
    };

    if (
        $('#jsNum1').val() == '' ||
        $('#jsNum2').val() == '' ||
        mathObject.operator == null
    ) {
        alert('Please complete all fields!');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/calc',
        data: mathObject,
    }).then((response) => {
        console.log(response);
        retrieveSolved();
    });
    clearInputs();
}

function retrieveSolved() {
    $.ajax({
            type: 'GET',
            url: '/solved',
        })
        .then((response) => {
            console.log('GET - response:', response);
            render(response.solved);
        })
        .catch(function(err) {
            console.log(err);
            alert('Oops.');
        });
}

function render(solved) {
    let a, b, op, answer;
    [a, b, op, answer] = [
        solved.num1,
        solved.num2,
        solved.operator,
        solved.result,
    ];
    $('#jsCalcResult').text(`${a} ${op} ${b} = ${answer}`);
    renderHistory();
}

function renderHistory() {
    $.ajax({
        type: 'GET',
        url: '/prevCalculations',
    }).then((response) => {
        console.log('in history', response);
        let history = response;
        $('#jsHistory').empty();
        for (let each of history) {
            $('#jsHistory').append(`
            <li class="jsHistoricalItem" data-num1="${each.num1}" data-num2="${each.num2}" data-op="${each.operator}" >${each.num1} ${each.operator} ${each.num2} = ${each.result}</li>`);
        }
    });
}

function clearHistory() {
    $.ajax({
        type: 'DELETE',
        url: '/clearHistory',
    }).then((response) => {
        console.log('delete server history', response);
        renderHistory();
    });
}

function recompute() {
    $('#jsNum1').val($(this).data().num1);
    $('#jsNum2').val($(this).data().num2);
    operatorInput = $(this).data().op;
    performCalc();
}

function handleGUI() {
    let displayVal1 = 0;
    let displayVal2 = 0;
    if (operatorInput == null) {
        inputNum1.push($(this).val());
        displayVal1 = inputNum1.join('');
        console.log(displayVal1);
        $('#jsNum1').val(displayVal1);
    } else {
        inputNum2.push($(this).val());
        displayVal2 = inputNum2.join('');
        console.log(displayVal2);
        $('#jsNum2').val(displayVal2);
    }
}
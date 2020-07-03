$(document).ready(init);

let operatorInput = null;
let currentSolution = null;

function init() {
    console.log('js and jQuery loaded');
    $('.js-btn-operator').on('click', handleOp);
    $('#jsCalculate').on('click', performCalc);
    $('#jsClearInputs').on('click', clearInputs);
    $('#jsClearInputs').on('dblclick', clearHistory);
    $('#jsHistory').on('click', '.jsHistoricalItem', recompute);
    renderHistory();
}

function handleOp() {
    operatorInput = $(this).data('op');
}

function clearInputs() {
    $('#jsNum1').val('');
    $('#jsNum2').val('');
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
$(document).ready(init);

let opperatorInput = null;
let currentSolution = null;

function init() {
    console.log('js and jQuery loaded');
    $('.js-btn-opperator').on('click', handleOpp);
    $('#jsCalculate').on('click', performCalc);
    $('#jsClearInputs').on('click', clearInputs);
    $('#jsClearInputs').on('dblclick', clearHistory);
    $('#jsHistory').on('click', '.jsHistoricalItem', recompute);
    renderHistory();
}

function handleOpp() {
    opperatorInput = $(this).data('opp');
}

function clearInputs() {
    $('#jsNum1').val('');
    $('#jsNum2').val('');
}

function performCalc() {
    let mathObject = {
        num1: parseInt($('#jsNum1').val()),
        num2: parseInt($('#jsNum2').val()),
        opperator: opperatorInput,
    };

    if (
        $('#jsNum1').val() == '' ||
        $('#jsNum2').val() == '' ||
        mathObject.opperator == null
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
    let a, b, opp, answer;
    [a, b, opp, answer] = [
        solved.num1,
        solved.num2,
        solved.opperator,
        solved.result,
    ];
    $('#jsCalcResult').text(`${a} ${opp} ${b} = ${answer}`);
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
            <li class="jsHistoricalItem" data-num1="${each.num1}" data-num2="${each.num2}" data-opp="${each.opperator}" >${each.num1} ${each.opperator} ${each.num2} = ${each.result}</li>`);
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
    opperatorInput = $(this).data().opp;
}
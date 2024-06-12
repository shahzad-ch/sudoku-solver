const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const sudokuStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions
let solver = new Solver();
// console.log(sudokuStrings)
suite('Unit Tests', () => {
    test('handle a valid puzzle of 81 characters', function (){
        sudokuStrings.forEach((str) => {
            assert.equal(solver.validate(str[0], undefined))
        })
    })
    test('handle a puzzle with invalid characters', function (){
        const testStr1 = '..839.7.575.....964..1.../...16.29846.9.312.f..754.....62..5.78.8...3.2...492...1'
        assert.isObject(solver.validate(testStr1))
        assert.property(solver.validate(testStr1), 'error')
        assert.equal(solver.validate(testStr1).error, 'Invalid characters in puzzle')
    })
    test('handle a puzzle that is not of 81 characters', function(){
        const testStr2 = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...'
        assert.isObject(solver.validate(testStr2))
        assert.property(solver.validate(testStr2), 'error')
        assert.equal(solver.validate(testStr2).error, 'Expected puzzle to be 81 characters long')
    })
    test('handle a valid row placement', function (){
        assert.equal(solver.checkRowPlacement(sudokuStrings[0][0], '1', '1', 4), false)
    })
    test('handle an invalid row placement', function (){
        assert.equal(solver.checkRowPlacement(sudokuStrings[0][0], '1', '1', 3), true)
    })
    test('handle a valid column placement', function (){
        assert.equal(solver.checkColPlacement(sudokuStrings[0][0], '1', '1', 4), false)
    })
    test('handle an invalid column placement', function (){
        assert.equal(solver.checkRowPlacement(sudokuStrings[0][0], '1', '1', 7), true)
    })
    test('handle a valid region placement', function (){
        assert.equal(solver.checkRegionPlacement(sudokuStrings[0][0], '4', '3', 4), false)
    })
    test('handle an invalid region placement', function (){
        assert.equal(solver.checkRegionPlacement(sudokuStrings[0][0], '4', '3', 1), true)
    })
    test('valid puzzles pass the solver', function() {
        sudokuStrings.forEach((str) => {
            assert.equal(solver.solve(str[0]), str[1])
        })
    })
    test('invalid puzzle fail the solver', function() {
        const testStr3 = '1.5..2784..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        assert.property(solver.solve(testStr3), 'error')
        assert.equal(solver.solve(testStr3).error, 'Puzzle cannot be solved')
    })
    test('solver returns expected solution', function (){
        sudokuStrings.forEach((str) => {
            assert.equal(solver.solve(str[0]), str[1])
        })
    })
});

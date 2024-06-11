'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      // console.log(req.body)
      const r = req.body;
      const puzzle = r.puzzle;
      const val = r.value;
      let row = r.coordinate.split('')[0];
      let col = r.coordinate.split('')[1];
      col--;
      row = getRowIndex(row.toUpperCase());
      console.log('Row: ' + row + '   Col: ' + col)
      // solver.checkRowPlacement(puzzle, row, col, val)
      // console.log(solver.checkColPlacement(puzzle, row, col, val))
      // solver.checkRegionPlacement(puzzle, row, col, val)
      const ro = solver.checkRowPlacement(puzzle, row, col, val)
      const co = solver.checkColPlacement(puzzle, row, col, val)
      const re = solver.checkRegionPlacement(puzzle, row, col, val);
      console.log({row: ro, column: co, region: re})
      if(!ro && !co && !re) {
        res.send(false)
      }else res.send(true)
      // res.send({row: ro, column: co, region: re})

    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      console.log(puzzle)
      const board = solver.getRows(puzzle);
      const solvedBoard = solver.solve(board, puzzle);
      console.log(solvedBoard)
      // solver.checkRegionPlacement(puzzle);
    });
};

function getRowIndex(row) {
  switch (row) {
    case 'A':
      row = 0;
      break;
    case 'B':
      row = 1;
      break;
    case 'C':
      row = 2;
      break;
    case 'D':
      row = 3;
      break;
    case 'E':
      row = 4;
      break;
    case 'F':
      row = 5;
      break;
    case 'G':
      row = 6;
      break;
    case 'H':
      row = 7;
      break;
    case 'I':
      row = 8;
      break;
  }
  return row;
}
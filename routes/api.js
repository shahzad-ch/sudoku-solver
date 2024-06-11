'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      // console.log(req.body)
      const coordinate = req.body.coordinate;
      const puzzle = req.body.puzzle;
      const val = req.body.value;
      if(!coordinate || !puzzle || !val){
        return res.send({error: 'Required field(s) missing'})
      }
      const valid = solver.validate(puzzle)
        if(valid) {
          return res.send(valid)
        }
        console.log(coordinate)
      if(coordinate.length != 2) {
        return res.send({error: 'Invalid coordinate'})
      }
      if(!(val >= 0 && val <= 9)) {
        return res.send({error: "Invalid value"})
      }
      


      let row = coordinate.split('')[0];
      let col = coordinate.split('')[1];
      col--;
      row = getRowIndex(row.toUpperCase());
      if(row == -1){
        return res.send({error: 'Invalid coordinate'})
      }
      console.log('Row: ' + row + '   Col: ' + col)
      let conflict = [];
      const ro = solver.checkRowPlacement(puzzle, row, col, val)
      if (ro) conflict.push('row')
      console.log(ro)
      const co = solver.checkColPlacement(puzzle, row, col, val)
      if (co) conflict.push('column')
      console.log(co)
      const re = solver.checkRegionPlacement(puzzle, row, col, val);
      if (re) conflict.push('region')
      console.log(re)
      if (!ro && !co && !re) {
        return res.send({valid: true})
      }
      return res.send({valid: false, conflict: conflict})

    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.send({error: 'Required field missing'})
      }
      const valid = solver.validate(puzzle)
      if(valid) {
        return res.send(valid);
      }
      const solution = solver.solve(puzzle);
      console.log(solution)
      if (typeof solution === 'object') {
        return res.send(solution)
      }
      // solver.checkRegionPlacement(puzzle);
      res.send({solution})
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
    default:
      row = -1;
  }
  return row;
}
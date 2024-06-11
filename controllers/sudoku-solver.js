class SudokuSolver {
  getRows(str) {
    let rows = [];
    let j = 0;

    for (let i = 0; i < 9; i++) {
      rows.push(str.slice(j, j = (i + 1) * 9).split(''));
    }
    return rows;
  }

  getCols(str) {
    const arr = str.split('');
    let i = 0;
    let cols = [[], [], [], [], [], [], [], [], []]
    while (i < 81) {
      for (let j = 0; j < 9; j++) {
        cols[j].push(arr[i])
        i++;
      }
    }
    return cols;
  }

  getRegions(str) {
    const arr = this.getRows(str)
    let grids = [[], [], [], [], [], [], [], [], []]
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const gridIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        grids[gridIndex].push(arr[row][col]);
      }
    }
    return grids;
  }

  validate(puzzleString) {
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const arr = this.getRows(puzzleString);
    // console.log(arr[row])
    return (arr[row].includes(value.toString()));
  }

  checkColPlacement(puzzleString, row, column, value) {
    const arr = this.getCols(puzzleString)

    return arr[column].includes(value.toString())
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const arr = this.getRegions(puzzleString)
    const r = Math.floor(row / 3);
    const c = Math.floor(column / 3);
    const index = r * 3 + c;
    // console.log(arr[index])
    return arr[index].includes(value.toString());
    // console.log(arr)

  }

  checkPlacement(puzzle, row, col, val) {
    if (this.checkRowPlacement(puzzle, row, col, val) || this.checkColPlacement(puzzle, row, col, val)
      || this.checkRegionPlacement(puzzle, row, col, val)) {
      return true;
    }
    return false
  }
  findEmptyBox(board) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] == '.') {
          return [i, j]
        }
      }
    }
    return null
  }

  solve(board, puzzle) {
    let slot = this.findEmptyBox(board)
    const row = slot[0];
    const column = slot[1]

    if (!slot) {
      console.log('backtracking done')
      return board;
    }

    for (let num = 1; num <= 9; num++) {

      if (this.checkPlacement(puzzle, row, column, num)) {
        board[row][column] = num.toString();

        if (this.solve(board)) {
          return true;
        }
        
        board[row][column] = '.'
      }

    }

    return false;

  }
}
// console.log('---------' + i + '------')

module.exports = SudokuSolver;

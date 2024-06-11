class SudokuSolver {
  getRows(str) {
    // console.log(typeof(str)) 
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
    if(/[^0-9.]/g.test(puzzleString)) {
      return {error: 'Invalid characters in puzzle'}
    }

    if(puzzleString.length != 81){
      return {error: 'Expected puzzle to be 81 characters long'}
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const arr = this.getRows(puzzleString);
    // console.log(arr[row])
    if (arr[row][column] == value) {
      return false;
    }
    return (arr[row].includes(value.toString()));
  }

  checkColPlacement(puzzleString, row, column, value) {
    const arr = this.getCols(puzzleString)
    if (arr[row][column] == value) {
      console.log('init')
      return false;
    }
    return arr[column].includes(value.toString())
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const arr = this.getRegions(puzzleString)
    const r = Math.floor(row / 3);
    const c = Math.floor(column / 3);
    const index = r * 3 + c;
    // console.log(arr[index])
    if (arr[index][(row % 3) * 3 + (column % 3)] == value) {
      console.log('init')
      return false;
    }
    return arr[index].includes(value.toString());
    // console.log(arr)

  }

  checkPlacement(board, row, col, num) {
    // if (this.checkRowPlacement(puzzle, row, col, val) || this.checkColPlacement(puzzle, row, col, val)
    //   || this.checkRegionPlacement(puzzle, row, col, val)) {
    //   return false;
    // }
    // return true;
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num.toString()) {
        return false;
      }
    }

    // Check the column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num.toString()) {
        return false;
      }
    }

    // Check the 3x3 sub-grid
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num.toString()) {
          return false;
        }
      }
    }

    return true;
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

  boardSolver(board) {
    let slot = this.findEmptyBox(board);
    if (!slot) {
      return true; 
    }

    let row = slot[0];
    let col = slot[1];

    for (let num = 1; num <= 9; num++) {
      if (this.checkPlacement(board, row, col, num)) {
        board[row][col] = num.toString();

        if (this.boardSolver(board)) {
          return true;
        }

        board[row][col] = '.'; // Backtrack
      }
    }

    return false;
  }

  solve(puzzle) {

    const board = this.getRows(puzzle)
    const solvedBoard = this.boardSolver(board)
    if(!solvedBoard) {
      return {error: 'Puzzle cannot be solved'}
    }
    return board.flat().join('');
  }
}
// console.log('---------' + i + '------')

module.exports = SudokuSolver;

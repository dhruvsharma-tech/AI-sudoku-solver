package com.sudoku.service;

import org.springframework.stereotype.Service;

/**
 * Backtracking algorithm se Sudoku solve karne ki service.
 * 
 * Algorithm:
 * 1. Empty cell dhundo (value == 0)
 * 2. 1-9 try karo
 * 3. Agar valid placement hai, woh number dalo
 * 4. Recursively aage solve karo
 * 5. Agar solve nahi hua → backtrack (0 rakh do)
 */
@Service
public class SolverService {

    /**
     * Public method - grid lo, solve karo, return karo.
     * @param board 9x9 int array (0 = empty cell)
     * @return Solved board, ya null agar unsolvable ho
     */
    public int[][] solve(int[][] board) {
        // Deep copy karo taaki original grid safe rahe
        int[][] boardCopy = deepCopy(board);

        if (solveSudoku(boardCopy)) {
            return boardCopy;
        }
        return null; // Sudoku unsolvable hai
    }

    /**
     * Recursive backtracking solver.
     */
    private boolean solveSudoku(int[][] board) {
        int row = -1;
        int col = -1;
        boolean isEmpty = false;

        // Pehla empty cell dhundo
        outer:
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == 0) {
                    row = i;
                    col = j;
                    isEmpty = true;
                    break outer;
                }
            }
        }

        // Koi empty cell nahi → sudoku solved!
        if (!isEmpty) {
            return true;
        }

        // 1-9 try karo
        for (int num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
                board[row][col] = num;

                if (solveSudoku(board)) {
                    return true;
                }

                // Backtrack
                board[row][col] = 0;
            }
        }

        return false; // Koi number valid nahi → backtrack
    }

    /**
     * Check karo ki num ko (row, col) pe rakhna valid hai ya nahi.
     * Sudoku rules: row, column, aur 3x3 box mein duplicate nahi hona chahiye.
     */
    private boolean isValidPlacement(int[][] board, int row, int col, int num) {
        // Row check - same row mein num already hai?
        for (int x = 0; x < 9; x++) {
            if (board[row][x] == num) return false;
        }

        // Column check - same column mein num already hai?
        for (int x = 0; x < 9; x++) {
            if (board[x][col] == num) return false;
        }

        // 3x3 box check
        int startRow = row - row % 3;
        int startCol = col - col % 3;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] == num) return false;
            }
        }

        return true;
    }

    /**
     * 2D array ka deep copy karo.
     */
    private int[][] deepCopy(int[][] original) {
        int[][] copy = new int[9][9];
        for (int i = 0; i < 9; i++) {
            System.arraycopy(original[i], 0, copy[i], 0, 9);
        }
        return copy;
    }
}

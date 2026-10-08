package com.sudoku.model;

/**
 * 9x9 Sudoku grid ka model class.
 * JSON serialization/deserialization ke liye use hota hai.
 */
public class SudokuGrid {

    private int[][] grid;

    public SudokuGrid() {}

    public SudokuGrid(int[][] grid) {
        this.grid = grid;
    }

    public int[][] getGrid() {
        return grid;
    }

    public void setGrid(int[][] grid) {
        this.grid = grid;
    }
}

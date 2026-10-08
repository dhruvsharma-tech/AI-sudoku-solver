package com.sudoku.controller;

import com.sudoku.model.SudokuGrid;
import com.sudoku.service.SolverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for Sudoku solving endpoint.
 * Node.js orchestrator yahan request bhejta hai.
 */
@RestController
@RequestMapping("/api/sudoku")
@CrossOrigin(origins = {"http://node-service:3000", "http://localhost:3000"})
public class SolverController {

    @Autowired
    private SolverService solverService;

    /**
     * POST /api/sudoku/solve
     * 
     * Request body:
     * { "grid": [[0,5,0,...], [3,0,0,...], ...] }
     * 
     * Response:
     * { "grid": [[4,5,2,...], [3,8,1,...], ...] }
     */
    @PostMapping("/solve")
    public ResponseEntity<?> solveSudoku(@RequestBody SudokuGrid request) {
        // Input validation
        int[][] inputGrid = request.getGrid();
        if (inputGrid == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Grid null nahi honi chahiye"));
        }
        if (inputGrid.length != 9) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Grid exactly 9 rows ki honi chahiye"));
        }
        for (int i = 0; i < 9; i++) {
            if (inputGrid[i] == null || inputGrid[i].length != 9) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Har row exactly 9 columns ki honi chahiye"));
            }
            for (int j = 0; j < 9; j++) {
                if (inputGrid[i][j] < 0 || inputGrid[i][j] > 9) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Grid values 0-9 ke beech honi chahiye"));
                }
            }
        }

        int[][] solvedGrid = solverService.solve(inputGrid);

        if (solvedGrid == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Sudoku solve nahi ho saka - invalid puzzle"));
        }

        return ResponseEntity.ok(new SudokuGrid(solvedGrid));
    }

    /**
     * GET /api/sudoku/health
     * Health check endpoint
     */
    @GetMapping("/health")
    public String healthCheck() {
        return "Java Sudoku Solver service running on port 8080";
    }
}

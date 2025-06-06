
# Backtracking

**Backtracking** is a general algorithmic technique that involves searching through all possible configurations of a solution and abandoning ("backtracking") a path as soon as it's determined that it cannot possibly lead to a valid solution.

Backtracking is commonly used in problems involving permutations, combinations, and constraint satisfaction problems like Sudoku, N-Queens, and mazes.

---

## Core Concept

Backtracking is based on recursion and is used to build solutions incrementally, removing those solutions that fail to satisfy the constraints of the problem.

Steps involved in backtracking:
1. Choose: Select a possible option.
2. Explore: Recursively explore this option.
3. Un-choose (Backtrack): Undo the choice and try another option.

---

## Template for Backtracking

```text
Backtrack(candidate)
  if candidate is a solution
    add candidate to results
    return
  for next_candidate in list_of_next_options(candidate)
    if is_valid(next_candidate)
      Backtrack(next_candidate)
end Backtrack
````

---

## Applications of Backtracking

### 1. N-Queens Problem

Place N queens on an N×N chessboard so that no two queens attack each other.

```text
SolveNQueens(board, row)
  if row == N
    print board
    return
  for col = 0 to N-1
    if isSafe(board, row, col)
      placeQueen(board, row, col)
      SolveNQueens(board, row + 1)
      removeQueen(board, row, col) // backtrack
end SolveNQueens
```

### 2. Sudoku Solver

Fill a 9x9 Sudoku grid so that each number appears only once per row, column, and 3x3 subgrid.

```text
SolveSudoku(board)
  for each cell in board
    if cell is empty
      for digit from 1 to 9
        if isValid(board, row, col, digit)
          board[row][col] = digit
          if SolveSudoku(board) == true
            return true
          board[row][col] = 0 // backtrack
      return false
  return true
end SolveSudoku
```

### 3. Subset Sum Problem

Find all subsets of a given set whose sum is equal to a target value.

```text
SubsetSum(nums, index, current, target)
  if sum(current) == target
    print current
    return
  if index == length(nums) or sum(current) > target
    return
  SubsetSum(nums, index + 1, current + [nums[index]], target)
  SubsetSum(nums, index + 1, current, target) // backtrack
end SubsetSum
```

### 4. Permutations

Generate all permutations of a given array.

```text
Permute(nums, start)
  if start == length(nums)
    print nums
    return
  for i = start to length(nums) - 1
    swap(nums[start], nums[i])
    Permute(nums, start + 1)
    swap(nums[start], nums[i]) // backtrack
end Permute
```

---

## Time and Space Complexity

```text
| Problem       | Time Complexity         | Space Complexity |
| ------------- | ----------------------- | ---------------- |
| N-Queens      | O(N!)                   |      O(N²)       |
| Sudoku Solver | O(9ⁿ) (n = empty cells) |      O(1)        |
| Subset Sum    | O(2ⁿ)                   |      O(n)        |
| Permutations  | O(n × n!)               |      O(n)        |
```

> **Note:** Backtracking algorithms can be optimized using pruning techniques to reduce the search space.

---

## References

* [Wikipedia - Backtracking](https://en.wikipedia.org/wiki/Backtracking)
* [GeeksforGeeks - Backtracking](https://www.geeksforgeeks.org/backtracking-algorithms/)




# Binary Search

**Binary Search** is a searching algorithm used in a sorted array by repeatedly dividing the search interval in half. If the value of the search key is less than the item in the middle of the interval, narrow the interval to the lower half. Otherwise, narrow it to the upper half. Repeatedly check until the value is found or the interval is empty.

## Properties

* Input must be **sorted**
* Time complexity is **O(log n)**
* Space complexity is **O(1)** for iterative and **O(log n)** for recursive (due to call stack)

## Pseudocode

### Iterative Version

```text
BinarySearch(array, target)
  low ← 0
  high ← length(array) - 1
  while low ≤ high
    mid ← low + (high - low) / 2
    if array[mid] = target
      return mid
    else if array[mid] < target
      low ← mid + 1
    else
      high ← mid - 1
    end if
  end while
  return -1 // not found
end BinarySearch
```

### Recursive Version

```text
BinarySearchRecursive(array, target, low, high)
  if low > high
    return -1
  mid ← low + (high - low) / 2
  if array[mid] = target
    return mid
  else if array[mid] > target
    return BinarySearchRecursive(array, target, low, mid - 1)
  else
    return BinarySearchRecursive(array, target, mid + 1, high)
  end if
end BinarySearchRecursive
```

## Time Complexity
```text
| Case    | Complexity |
| ------- | ---------- |
| Best    | O(1)       |
| Average | O(log n)   |
| Worst   | O(log n)   |
```

## Space Complexity

* **Iterative**: O(1)
* **Recursive**: O(log n) (due to recursion stack)

## Applications

* Finding elements in a sorted array
* Search in rotated arrays
* Upper/Lower bound problems
* Optimization problems using binary search on the answer space

## References

* [Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
* [YouTube - Binary Search](https://www.youtube.com/watch?v=K5ABwMZt4Uo)
* [GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)

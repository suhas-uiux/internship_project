# Two Pointer Technique

The **two-pointer technique** is a common and efficient approach in algorithm design, particularly used for searching pairs in a sorted array, removing duplicates, reversing arrays, and solving problems involving arrays or linked lists. It involves using two indices (pointers) to traverse data structures, usually from either end or at different speeds.

There are several variations of the two-pointer method:

* **Same-direction** (sliding window)
* **Opposite-direction**
* **Fast and slow pointers**

## Common Use Cases

* Pair with given sum
* Detect cycle in a linked list
* Reverse an array or list
* Remove duplicates
* Merge sorted arrays
* Trapping rainwater

## Pseudocode Examples

### 1. Same Direction Traversal

Used when scanning the array or list in one direction.

```text
TwoPointerSameDirection(array)
  i ← 0
  j ← 0
  while j < length(array)
    // Process elements between i and j
    j ← j + 1
  end while
end TwoPointerSameDirection
```

### 2. Opposite Direction Traversal

Used in problems involving sorted arrays, like finding two elements that sum to a target.

```text
TwoPointerOppositeDirection(array, target)
  i ← 0
  j ← length(array) - 1
  while i < j
    sum ← array[i] + array[j]
    if sum = target
      return true
    else if sum < target
      i ← i + 1
    else
      j ← j - 1
    end if
  end while
  return false
end TwoPointerOppositeDirection
```

### 3. Slow and Fast Pointers

Used to detect cycles in linked lists.

```text
HasCycle(head)
  slow ← head
  fast ← head
  while fast != null and fast.next != null
    slow ← slow.next
    fast ← fast.next.next
    if slow = fast
      return true
    end if
  end while
  return false
end HasCycle
```
### 4. Find a Pair with Given Sum (Sorted Array)

```text
FindPair(arr, target)
  left ← 0
  right ← length(arr) - 1
  while left < right
    sum ← arr[left] + arr[right]
    if sum = target
      return (arr[left], arr[right])
    else if sum < target
      left ← left + 1
    else
      right ← right - 1
  end while
  return null
end FindPair
```

### 5. Reverse an Array

```text
Reverse(arr)
  left ← 0
  right ← length(arr) - 1
  while left < right
    swap arr[left] and arr[right]
    left ← left + 1
    right ← right - 1
  end while
end Reverse
```

### 6. Detect Cycle in Linked List (Floyd's Cycle Detection)

```text
HasCycle(head)
  slow ← head
  fast ← head
  while fast != null and fast.next != null
    slow ← slow.next
    fast ← fast.next.next
    if slow = fast
      return true
  end while
  return false
end HasCycle
```

### 7. Remove Duplicates from Sorted Array

```text
RemoveDuplicates(arr)
  if length(arr) = 0
    return 0
  index ← 1
  for i ← 1 to length(arr) - 1
    if arr[i] != arr[i - 1]
      arr[index] ← arr[i]
      index ← index + 1
  end for
  return index
end RemoveDuplicates
```

## Time Complexity

* Same Direction: O(n)
* Opposite Direction: O(n)
* Slow and Fast: O(n)
```text
|        Technique            |  Operation  |  Time Complexity   |  Space Complexity   |
|-----------------------------|-------------|--------------------|---------------------|
| *Slow and Fast*             |      -      |       O(n)         |        O(1)         |
| Pair Sum (Sorted)           |      -      |       O(n)         |        O(1)         |
| Reverse Array               |      -      |       O(n)         |        O(1)         |
| Cycle Detection             |      -      |       O(n)         |        O(1)         |
| Remove Duplicates (Sorted)  |      -      |       O(n)         |        O(1)         |
```




## Space Complexity

* All patterns use O(1) space.

## References

* [GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/)
* [Leetcode Patterns](https://leetcode.com)
* [GeeksforGeeks - Two Pointer Approach](https://www.geeksforgeeks.org/two-pointers-technique/)
* [YouTube - Two Pointers Explained](https://www.youtube.com/watch?v=UbyhOgBN834)

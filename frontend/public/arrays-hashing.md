# Arrays & Hashing

**Arrays** are fixed-size data structures used to store elements of the same type in contiguous memory locations.  
**Hashing** involves mapping data to a fixed-size table using hash functions, enabling fast data access, insertion, and deletion.

This topic forms the foundation for many algorithmic techniques and data manipulation problems.

---

## Core Concepts

### Arrays

- Index-based data structure.
- Allows constant-time access using the index.
- Useful for problems involving iteration, searching, and sorting.

### Hashing

- Uses a hash function to compute an index in a hash table.
- Enables near O(1) average time complexity for insert, delete, and lookup operations.

---

## Common Patterns

### 1. Hash Map / Hash Set Usage

Used for:
- Checking duplicates.
- Counting occurrences.
- Caching intermediate results.

---

## Example Problems

### 1. Two Sum

Given an array `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

```text
TwoSum(nums, target)
  map = {}
  for i in range(len(nums)):
    complement = target - nums[i]
    if complement in map:
      return [map[complement], i]
    map[nums[i]] = i
end TwoSum
```

### 2. Contains Duplicate
Check if any value appears at least twice in the array.

```text
ContainsDuplicate(nums)
  seen = set()
  for num in nums:
    if num in seen:
      return true
    seen.add(num)
  return false
end ContainsDuplicate
```
### 3. Group Anagrams
Group words that are anagrams of each other.

```text
GroupAnagrams(words)
  map = defaultdict(list)
  for word in words:
    key = sorted(word)
    map[key].append(word)
  return list(map.values())
end GroupAnagrams
```

### 4. Top K Frequent Elements
Return the k most frequent elements from an array.

```text
TopKFrequent(nums, k)
  count = Counter(nums)
  heap = []
  for num, freq in count.items():
    heappush(heap, (-freq, num))
  result = []
  for _ in range(k):
    result.append(heappop(heap)[1])
  return result
end TopKFrequent
```

## Time and Space Complexity


```text
| Problem             | Time Complexity | Space Complexity |
| ------------------- | --------------- | ---------------- |
| Two Sum             | O(n)            | O(n)             |
| Contains Duplicate  | O(n)            | O(n)             |
| Group Anagrams      | O(n·k·logk)      | O(n·k)           |
| Top K Frequent      | O(n·logk)        | O(n)             |
```

> **Note:** Hash maps and sets are extremely useful in interview problems to reduce time complexity and enable efficient lookups.

### References
* [GeeksforGeeks - Arrays](https://www.geeksforgeeks.org/array-data-structure-guide/)

* [GeeksforGeeks - Hashing](https://www.geeksforgeeks.org/hashing-data-structure/)


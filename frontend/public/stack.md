# Stack

In computer science, a **stack** is an abstract data type that serves as a collection of elements, with two principal operations:

* **Push**, which adds an element to the collection, and
* **Pop**, which removes the most recently added element that was not yet removed.

The order in which elements come off a stack gives rise to its alternative name, **LIFO** (last in, first out). A stack can be visualized as a vertical stack of objects, such as plates, where you can only take from the top or add to the top.

Stacks are used extensively in programming for things like function call management, undo mechanisms, parsing expressions, and more.

## Pseudocode for Basic Operations

### Push

```text
Push(stack, value)
  Pre: stack is the stack, value is the value to add
  Post: value is added to the top of the stack
  stack.top ← stack.top + 1
  stack.items[stack.top] ← value
end Push
```

### Pop

```text
Pop(stack)
  Pre: stack is the stack
  Post: the most recently added item is removed and returned
  if stack.top = -1
    error "Stack Underflow"
  end if
  value ← stack.items[stack.top]
  stack.top ← stack.top - 1
  return value
end Pop
```

### Peek (Top)

```text
Peek(stack)
  Pre: stack is the stack
  Post: the top value is returned without modifying the stack
  if stack.top = -1
    error "Stack is empty"
  end if
  return stack.items[stack.top]
end Peek
```

### IsEmpty

```text
IsEmpty(stack)
  Pre: stack is the stack
  Post: true if stack is empty, false otherwise
  return stack.top = -1
end IsEmpty
```

### Traverse

```text
Traverse(stack)
  Pre: stack is the stack
  Post: stack elements are traversed from top to bottom
  for i ← stack.top to 0
    yield stack.items[i]
  end for
end Traverse
```

## Time Complexity
```text
| Operation | Time Complexity |
| :-------: | :-------------: |
|    Push   |       O(1)      |
|    Pop    |       O(1)      |
|    Peek   |       O(1)      |
|  IsEmpty  |       O(1)      |
```

## Space Complexity

O(n), where **n** is the number of elements in the stack.

## References

* [Wikipedia](https://en.wikipedia.org/wiki/Stack_%28abstract_data_type%29)
* [YouTube](https://www.youtube.com/watch?v=wjI1WNcIntg&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

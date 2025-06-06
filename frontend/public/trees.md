# Trees

In computer science, a **tree** is a hierarchical data structure consisting of nodes connected by edges. Each tree has a root node and subtrees, which are recursively structured in a tree-like fashion. Trees are widely used in various applications such as file systems, databases, and hierarchical structures.

## Types of Trees

### 1. Binary Tree

A **binary tree** is a tree where each node has at most two children, referred to as the **left** and **right** children.

#### Operations on Binary Tree

* **Traversal**: Inorder, Preorder, Postorder
* **Insertion**: Insert a node in a tree
* **Deletion**: Delete a node from the tree

### 2. Binary Search Tree (BST)

A **binary search tree** is a binary tree in which each node has the following properties:

* The left child’s value is less than the parent node’s value.
* The right child’s value is greater than the parent node’s value.

This property allows for efficient searching, insertion, and deletion operations.

#### Operations on Binary Search Tree

* **Insertion**: Insert a node maintaining the BST property.
* **Deletion**: Delete a node from a BST while maintaining the tree’s structure.
* **Search**: Search for an element in the tree.

### 3. AVL Tree

An **AVL tree** (named after Adelson-Velsky and Landis) is a type of self-balancing binary search tree. The heights of two child subtrees of any node differ by at most one, ensuring that the tree remains balanced.

#### Rotations

To maintain the AVL property, rotations are performed:

* **Left Rotation**
* **Right Rotation**
* **Left-Right Rotation**
* **Right-Left Rotation**

```text
LeftRotation(root)
  x ← root.left
  root.left ← x.right
  x.right ← root
  root.height ← max(height(root.left), height(root.right)) + 1
  x.height ← max(height(x.left), height(x.right)) + 1
  return x
end LeftRotation
```

```text
RightRotation(root)
  x ← root.right
  root.right ← x.left
  x.left ← root
  root.height ← max(height(root.left), height(root.right)) + 1
  x.height ← max(height(x.left), height(x.right)) + 1
  return x
end RightRotation
```

#### Balancing the AVL Tree

After each insertion or deletion, the balance factor of the tree is checked, and appropriate rotations are performed to restore balance.

### 4. Red-Black Tree

A **red-black tree** is another type of self-balancing binary search tree with additional properties to balance itself. In a red-black tree:

* Every node is either red or black.
* The root is always black.
* Red nodes cannot have red children.
* Every path from a node to its descendants contains the same number of black nodes.

### 5. Heap

A **heap** is a specialized tree-based data structure that satisfies the **heap property**. The heap property ensures that for a min-heap, the parent node is always smaller than its children, while for a max-heap, the parent node is always greater.

#### Types of Heap

* **Min-Heap**: Parent node’s value is less than or equal to the values of its children.
* **Max-Heap**: Parent node’s value is greater than or equal to the values of its children.

### 6. Trie (Prefix Tree)

A **trie** is a type of tree used to store strings where each node represents a character of the string. It is often used for fast lookup, especially in applications like autocomplete and spell-checking.

### 7. Segment Tree

A **segment tree** is a binary tree used for storing intervals or segments. It is useful for answering range queries efficiently, such as finding the sum or minimum value in a range.

### 8. B-Tree

A **B-tree** is a self-balancing tree data structure that maintains sorted data and allows efficient insertion, deletion, and searching. B-trees are commonly used in databases and file systems.

---

## Common Tree Operations

### Insertion

Inserting a node into a tree depends on the type of tree. For example:

* In a **binary tree**, a node is inserted at the first available spot.
* In a **binary search tree**, the node is inserted based on its value compared to the root node’s value.

```text
Insert(root, value)
  if root is null
    return new node(value)
  else if value < root.value
    root.left ← Insert(root.left, value)
  else
    root.right ← Insert(root.right, value)
  return root
end Insert
```

### Deletion

When deleting a node, the tree needs to maintain its structure. If the node to be deleted has two children, the node is replaced by the in-order successor or predecessor.

```text
Delete(root, value)
  if root is null
    return root
  if value < root.value
    root.left ← Delete(root.left, value)
  else if value > root.value
    root.right ← Delete(root.right, value)
  else
    if root.left is null
      return root.right
    else if root.right is null
      return root.left
    temp ← FindMin(root.right)
    root.value ← temp.value
    root.right ← Delete(root.right, temp.value)
  return root
end Delete
```

### Traversal

Traversal is the process of visiting all the nodes in a tree in a specific order. Common tree traversal methods are:

* **Inorder Traversal** (left, root, right)
* **Preorder Traversal** (root, left, right)
* **Postorder Traversal** (left, right, root)
* **Level-Order Traversal** (breadth-first)

#### Inorder Traversal

```text
InorderTraversal(root)
  if root is not null
    InorderTraversal(root.left)
    visit(root)
    InorderTraversal(root.right)
end InorderTraversal
```

#### Preorder Traversal

```text
PreorderTraversal(root)
  if root is not null
    visit(root)
    PreorderTraversal(root.left)
    PreorderTraversal(root.right)
end PreorderTraversal
```

#### Postorder Traversal

```text
PostorderTraversal(root)
  if root is not null
    PostorderTraversal(root.left)
    PostorderTraversal(root.right)
    visit(root)
end PostorderTraversal
```

### Searching

Searching for a node in a tree depends on the tree type. For a binary search tree, searching can be done efficiently by comparing values.

```text
Search(root, value)
  if root is null or root.value == value
    return root
  if value < root.value
    return Search(root.left, value)
  else
    return Search(root.right, value)
end Search
```

---

## Time Complexity of Tree Operations
```text
| Operation     | Time Complexity                                         |
| ------------- | ------------------------------------------------------- |
| **Insertion** | O(log n) for balanced trees (O(n) for unbalanced trees) |
| **Deletion**  | O(log n) for balanced trees (O(n) for unbalanced trees) |
| **Search**    | O(log n) for balanced trees (O(n) for unbalanced trees) |
| **Traversal** | O(n)                                                    |
```
### Space Complexity

The space complexity of tree operations is **O(n)**, where **n** is the number of nodes in the tree.

---

## References

* [Wikipedia - Tree Data Structure](https://en.wikipedia.org/wiki/Tree_%28data_structure%29)
* [GeeksforGeeks - Tree Data Structures](https://www.geeksforgeeks.org/binary-tree-data-structure/)

---

/*******************************************************************************
@file `avl-tree.ts`
  Created July 22, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

export class AVLTree<K, V> {
  constructor(compareKeys?: (a: K, b: K) => number) {
    if (compareKeys !== undefined)
      this.compareKeys = compareKeys
  }
  private compareKeys: (a: K, b: K) => number = (a: K, b: K) => {
    if (a < b)
      return -1
    if (a > b)
      return 1
    return 0
  }
  private root: AVLNode<K, V> | null
  get(key: K): V | undefined {
    const node = this.getNode(key)
    return node === null ? undefined : node.value
  }
  set(key: K, value: V): void {
    const node = this.getNode(key, value)!
    node.value = value
    this.balance(node)
  }
  private getNode(key: K, value?: V): AVLNode<K, V> | null {
    const inode = value !== undefined ? new AVLNode(key, value) : null
    let current = this.root === null ? inode : this.root
    while (current !== null) {
      const cmp = this.compareKeys(key, current.key)
      if (cmp === 0)
        break
      const next = cmp < 0 ? current.left : current.right
      current = next === null ? inode : next
    }
    return current
  }
  private getDepth(node: AVLNode<K, V> | null) {
    return node === null ? 0 : node.depth
  }
  private balance(current: AVLNode<K, V> | null): void {
    while (current !== null) {
      let leftDepth = this.getDepth(current.left)
      let rightDepth = this.getDepth(current.right)
      const balance = rightDepth - leftDepth
      if (balance > 1) {
        if (this.getDepth(current.right!.left)
          > this.getDepth(current.right!.right)) {
          this.rotateRight(current.right!)
          current.right!.depth = this.getDepth(current.right!.right) + 1
        }
        this.rotateLeft(current)
        rightDepth = this.getDepth(current.right)
      } else if (balance < -1) {
        if (this.getDepth(current.left!.right)
          > this.getDepth(current.left!.left)) {
          this.rotateLeft(current.left!)
          current.left!.depth = this.getDepth(current.left!.left) + 1
        }
        this.rotateRight(current)
        leftDepth = this.getDepth(current.left)
      }
      current.depth = (leftDepth < rightDepth ? rightDepth : leftDepth) + 1
      current = current.parent
    }
  }
  private rotateLeft(node: AVLNode<K, V>): void {
    const parent = node.parent
    const right = node.right!
    if (parent === null)
      this.root = right
    else if (parent.right === node)
      parent.right = right
    else
      parent.left = right
    right.parent = parent
    node.parent = right
    node.right = right.left
    right.left = node
    if (node.right !== null)
      node.right.parent = node
  }
  private rotateRight(node: AVLNode<K, V>): void {
    const parent = node.parent
    const left = node.left!
    if (parent === null)
      this.root = left
    else if (parent.left === node)
      parent.left = left
    else
      parent.right = left
    left.parent = parent
    node.parent = left
    node.left = left.right
    left.right = node
    if (node.left !== null)
      node.left.parent = node
  }
}

class AVLNode<K, V> {
  constructor(public key: K, public value: V) { }
  parent: AVLNode<K, V> | null = null
  left: AVLNode<K, V> | null = null
  right: AVLNode<K, V> | null = null
  depth: number = 1
}

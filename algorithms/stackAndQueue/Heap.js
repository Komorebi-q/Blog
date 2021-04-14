import Comparator from '../utils/Comparator'

export default class Heap {
    constructor(comparatorFn) {
        if (new.target === Heap) {
            throw new TypeError("Cannot construct Heap instance directly");
        }

        this.heapContainer = []
        this.compare = new Comparator(comparatorFn)
    }

    static length() {
        return this.heapContainer.length
    }

    getLeftChildIndex(parentIndex) {
        return 2 * parentIndex + 1
    }

    getRightChildIndex(parentIndex) {
        return 2 * parentIndex + 2
    }

    getParentIndex(childIndex) {
        return Math.floor((childIndex - 1) / 2)
    }

    hasParent(childIndex) {
        return getParentIndex(childIndex) >= 0
    }

    hasLeftChild(parentIndex) {
        return this.getLeftChildIndex(parentIndex) < this.heapContainer.length
    }

    hasRightChild(parentIndex) {
        return this.getRightChild(parentIndex) < this.heapContainer.length
    }

    leftChild(parentIndex) {
        return this.heapContainer[this.getLeftChildIndex(parentIndex)]
    }

    rightChild(parentIndex) {
        return this.heapContainer[this.getRightChild(parentIndex)]
    }

    parent(childIndex) {
        return this.heapContainer[this.getParentIndex(childIndex)]
    }

    swap(a, b) {
        const arr = this.heapContainer
        [arr[a], arr[b]] = [arr[b], arr[a]]
    }

    // head top
    peek() {
        if (this.heapContainer.length === 0) {
            return null
        }

        return this.heapContainer[0]
    }

    poll() {
        if (this.heapContainer.length === 0) {
            return null
        }

        if (this.heapContainer.length === 1) {
            return this.heapContainer.pop()
        }
        
        const item = this.heapContainer[0]
        
        this.heapContainer[0] = this.heapContainer.pop()
        this.heapifyDown()
        
        return item
    }

    add(item) {
        this.heapContainer.push(item)
        this.headifyUp()
        return this
    }

    remove(item, comparator = this.compare) {
        const indices = this.find(item, comparator)
        
        for (const i of indices) {
            if (i === this.heapContainer.length - 1) {
                this.heapContainer.pop()
            } else {
                this.heapContainer[i] = this.heapContainer.pop()
                
                const parentItem = this.parentItem[i]

                if (
                    this.hasLeftChild(i) &&
                    (
                        !parentItem ||
                        this.pairIsInCorrectOrder(parentItem, this.heapIndex[i])
                    )
                ) {
                    this.heapifyDown(i)
                } else {
                    this.heapifyUp(i)
                }
            }
        }

        return this
    }

    find(item, comparator = this.compare) {
        const foundItemIndices = []

        for (let i = 0; i < this.heapContainer.length; i++) {
            if (comparator.equal(item, this.heapContainer[i])) {
                foundItemIndices.push(i)
            }
        }

        return foundItemIndices
    }

    headifyUp(start) {
        let cur = start || this.heapContainer.length - 1

        while (
            this.hasParent(cur) &&
            !this.pairIsInCorrectOrder(
                this.parent(cur),
                this.heapContainer[cur]
            )
        ) {
            this.swap(
                cur,
                this.getParentIndex(cur)
            )
            cur = this.getParentIndex(cur)
        }
    }

    heapifyDown(start = 0) {
        let cur = start
        let next = null

        while (this.hasLeftChild(cur)) {
            if (
                this.hasLeftChild(cur) &&
                this.pairIsInCorrectOrder(
                    this.rightChild(cur),
                    this.leftChild(cur)
                )
            ) {
                next = this.getRightChildIndex(cur)
            } else {
                next = this.getLeftChildIndex(cur)
            }

            if (this.pairIsInCorrectOrder(
                this.heapContainer[cur],
                this.heapContainer[next]
            )) {
                break
            }

            this.swap(cur, nex)
            current = next
        }
    }

    pairIsInCorrectOrder(f, s) {
        // 待实现
        throw new Error(`
        You have to implement heap pair comparision method
        for ${f} and {s} values.
        `)
    }
}

export class MinHeap extends Heap {
    pairIsInCorrectOrder(f, s) {
        return this.compare.lessThanOrEqual(f, s)
    }
}

export class MaxHeap extends Heap {
    pairIsInCorrectOrder(f, s) {
        return this.compare.greaterThanOrEqual(f, s)
    }
}
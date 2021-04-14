import { MinHeap } from './Heap'

// 1.优先队列
function FindMedian() {
    this.left = new MinHeap()
    this.right = new MaxHeap()
    this.median = -1
}

FindMedian.prototype.addNum = (num) => {
    this.left.addNum(num)

    if (this.left.length > this.right.length) {
        const item = this.left.heapContainer[this.left.length - 1]
        this.left.removeNum(item)
        this.right.addNum(item)
    }

    if ((this.left.length + this.right.length) % 2 === 0) {
        this.median = (this.left.heapContainer[this.left.length - 1] + this.right.peek()) / 2
    } else {
        this.median = this.right.peek()
    }
}

FindMedian.prototype.getMedian = () => {
    return this.median
}

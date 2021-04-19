// 循环队列
// 设计你的循环队列实现。 循环队列是一种线性数据结构，其操作表现基于 FIFO（先进先出）原则并且队尾被连接在队首之后以形成一个循环。它也被称为“环形缓冲器”。
// 循环队列的一个好处是我们可以利用这个队列之前用过的空间。在一个普通队列里，一旦一个队列满了，我们就不能插入下一个元素，即使在队列前面仍有空间。但是使用循环队列，我们能使用这些空间去存储新的值。

function circularQueue(k = 10) {
    this.queue = new Array(k).fill(null)
    this.max = k
    this.header = -1
    this.tail = -1
}

// 从队首获取元素。如果队列为空，返回 -1 。
circularQueue.prototype.Front = function () {
    if (this.header <= 0) {
        return -1
    }

    return this.queue[this.header]
}
// 获取队尾元素。如果队列为空，返回 -1 。
circularQueue.prototype.Rear = function () {
    if (this.tail <= 0) {
        return -1
    }
    
    return this.queue[this.tail]
}
// 向循环队列插入一个元素。如果成功插入则返回真
circularQueue.prototype.enQueue = function (v) {
    if (this.queue.indexOf(v => v === null) === -1) {
        return false
    }
    
    if (this.header < 0) {
        this.header = 0
        this.tail = 0
        this.queue[0] = v
    } else {
        if (this.tail === this.max - 1) {
            this.tail = 0
            this.queue[0] = v
        } else {
            this.tail += 1
            this.queue[this.tail] = v
        }
    }

    return true
}
// 从循环队列中删除一个元素。如果成功删除则返回真
circularQueue.prototype.deQueue = function () {
    if (this.header < 0) {
        return false
    }

    if (this.header === this.max - 1) {
        this.queue[this.header] = null
        this.header = 0
    } else {
        this.queue[this.header] = null
        this.header += 1
    }

    return true
}
circularQueue.prototype.isEmpty = function () {
    return this.queue.indexOf(v => v === null) === -1
}
circularQueue.prototype.isFull = function () {
    return this.queue.indexOf(v => v === null) !== -1
}

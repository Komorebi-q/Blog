// 运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制 。

// 实现 LRUCache 类：
// LRUCache(int capacity) 以正整数作为容量 capacity 初始化 LRU 缓存
// int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
// void put(int key, int value) 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字-值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。

// 进阶：你是否可以在 O(1) 时间复杂度内完成这两种操作？

function LinkNode(v, k, prev, next) {
    this.v = v
    this.k = k
    this.prev = prev
    this.next = next
}

/**
 * @param {number} capacity
 */
function LRUCache (capacity) {
    this.length = capacity || 100
    this.map = {}
    this.head = null
    this.end = null
}

LRUCache.prototype.get = function (k) {
    const node = this.map[k]
    if (!node) {
        console.log('get: ', -1)
        return -1
    }
    this.remove(node)
    this.setHead(node)
    console.log('get: ', node.v)
    return node.v
}

LRUCache.prototype.put = function (k, v) {
    if (!this.map[k]) {
        const node = new LinkNode(v, k)
        if (Object.keys(this.map).length >= this.length) {
            if (this.end) {
                delete this.map[this.end.k]
            }
            this.remove(this.end)
        }
        this.setHead(node)
        this.map[k] = node
    } else {
        const node = this.map[k]
        node.v = v
        this.remove(node)
        this.setHead(node)
    }

    console.log('put: ', this.map)
}

LRUCache.prototype.remove = function (node) {
    const prev = node.prev
    const next = node.next

    if (prev) {
        prev.next = next
    }
    if (next) {
        next.prev = prev
    }

    node.prev = null
    node.next = null
}

LRUCache.prototype.setEnd = function (end) {
    end.next = null
    end.prev = null

    if (!this.end) {
        this.end = end
    } else {
        this.end.next = end
        end.prev = this.end
        this.end = end
    }

    if (!this.head) {
        this.head = end
    }
}

LRUCache.prototype.setHead = function (head) {
    head.next = null
    head.prev = null

    if (!this.head) {
        this.head = head
    } else {
        head.next = this.head
        this.head.prev = head
        this.head = head
    }

    if (!this.end) {
        this.end = head
    }
}

const lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1);    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2);    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1);    // 返回 -1 (未找到)
lRUCache.get(3);    // 返回 3
lRUCache.get(4);    // 返回 4

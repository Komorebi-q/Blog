'use strict'

let id = 0

function SingleLinkListNode({ data, next }) {
    this.next = next
    this.data = data
    this.id = i++
}

SingleLinkListNode.prototype.delete = function (id) {
    let node

    this.forEach((node) => {
        if (node.next !== null && node.next.id === id) {
            node = node
        }
    })

    if (node) {
        node.next = node.next.next

        return true
    }

    return false
}
SingleLinkListNode.prototype.insertToNext = function (data) {
    const node = new SingleLinkListNode({data})
    if (this.node.next !== null) {
        node.next = this.node.next
    }
    this.node.next = node
}
SingleLinkListNode.prototype.insertToTail = function (data,) {
    const tail = this.getTail()
    tail.next = new SingleLinkListNode({ data })
}
SingleLinkListNode.prototype.forEach = function (fn, getTail) {
    let node = this.node

    while (node.next !== null) {
        fn(node)
        node = node.next
    }

    if (getTail) {
        return node
    }
}
SingleLinkListNode.prototype.getTail = function () {
    return this.forEach(() => {}, true)
}

// https://leetcode-cn.com/leetbook/read/algorithm-and-interview-skills/xi8sr5/
// 给你一个链表，每 k 个节点一组进行翻转，请你返回翻转后的链表。
// k 是一个正整数，它的值小于或等于链表的长度。
// 如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。
// 进阶：
// 你可以设计一个只使用常数额外空间的算法来解决此问题吗？
// 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。


function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reverse(
    head, // 保持不变，改变的是 head.next
    end // 判断标准
) {
    if (!head) {
        throw new Error('must have node head and end')
    }
    // 保持头尾节点不动, cur 每次连接 head.next， last连接cur.next 完成 cur 翻转到头部
    let fakeHead = head
    let last = head.next
    let cur = last.next // 不包含 head

    while (cur !== end) { // 到 end 为止
        let temp = cur.next // 保存下一个要操作的节点
        cur.next = fakeHead.next // 当前操作节点连接已翻转后的节点
        fakeHead.next = cur // fakeHead 连接当前节点
        last.next = temp // 最后一个节点连接下一个要操作的节点
        cur = temp // 赋值下一节点
    }

    return last
}

function reverseKGroup(head, k) {
    if (!head || k <= 1) {
        return head
    }

    let index = 0
    let fakeHead = new ListNode('fakeHead')
    let reverseHead = fakeHead
    let cur = head
    fakeHead.next = head

    while (cur) { // 操作元素存在即可
        index += 1

        if (index % k !== 0) {
            cur = cur.next
            continue
        }

        reverseHead = reverse(reverseHead, cur.next)
        cur = reverseHead.next // 注意：cur.next 已经改变 
    }

    return fakeHead.next
}

let arr = []

for (let i = 0; i < new Array(10).fill(0).length; i++) {
    arr.push(new ListNode(i))
}
let i = 0
while (arr[i + 1]) {
    arr[i].next = arr[i + 1]
    i += 1
}
// console.log(' ========================> ', arr[0])

console.log(' ========================> ', reverseKGroup(arr[0], 2))



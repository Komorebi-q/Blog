// https://leetcode-cn.com/leetbook/read/algorithm-and-interview-skills/xigvfe/
// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
// 进阶：你能尝试使用一趟扫描实现吗？

/**
 *  遍历链表
 *  要删除的node 为 -(n-1)
 *  要删除的node 前一个 node 为 -n
 *  当 -n = 0; 赋值 prevRemoveNode 
 *  之后跟随遍历
 *  
 *  遍历结束后，如果存在 prevRemoveNode，删除 prevRemoveNode.next
 *  不存在返回 head.next === null (removeNode === head || removeNode === null)
*/

function removeNthFromEnd(head, n) {
    if (n <= 0 || !head) {
        return head
    }

    let i = -n
    let fakeHead = head
    let cur = head
    let prevRemoveNode

    while (cur) {
        if (i === 0) {
            prevRemoveNode = fakeHead
        } else if (i > 0) {
            prevRemoveNode = prevRemoveNode.next
        }
        
        cur = cur.next
        i += 1
    }

    if (prevRemoveNode) {
        let temp = prevRemoveNode.next
        prevRemoveNode.next = temp.next
        temp.next = null
    } else {
        return fakeHead.next
    }

    return fakeHead
}
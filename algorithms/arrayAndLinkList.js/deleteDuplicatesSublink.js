// 存在一个按升序排列的链表，给你这个链表的头节点 head ，请你删除链表中所有存在数字重复情况的节点，只保留原始链表中 没有重复出现 的数字。
// 返回同样按升序排列的结果链表。

function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function deleteDuplicates(head) {
    if (!head) { return head }

    let fakeHead = new ListNode(null)
    fakeHead.next = head
    let prev = fakeHead
    let cur = prev.next

    while (cur) {
        if (cur.next && prev.next.val === cur.next.val) {
            cur = cur.next
        } else {
            if (prev.next !== cur) {
                prev.next = cur.next
                cur = prev.next
            } else {
                prev = prev.next
                cur = cur.next
            }
        }
    }

    return fakeHead.next
}
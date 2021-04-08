// 给定一个单链表，把所有的奇数节点和偶数节点分别排在一起。请注意，这里的奇数节点和偶数节点指的是节点编号的奇偶性，而不是节点的值的奇偶性。
// 请尝试使用原地算法完成。你的算法的空间复杂度应为 O(1)，时间复杂度应为 O(nodes)，nodes 为节点总数。


function oddEvenList(head) {
    if (!head) {
        return
    }
    
    let odd = head
    let even = head.next
    let oddHead = head
    let evenHead = even

    // 有 even 和下一个 add
    while (even && even.next) {
        // 找到下一add， 就知道下一个even，赋值
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    }

    odd.next = evenHead
    
    return oddHead
}

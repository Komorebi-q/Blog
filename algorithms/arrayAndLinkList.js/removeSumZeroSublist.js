// 给你一个链表的头节点 head，请你编写代码，反复删去链表中由 总和 值为 0 的连续节点组成的序列，直到不存在这样的序列为止。
// 删除完毕后，请你返回最终结果链表的头节点。

// 示例 1：

// 输入：head = [1,2,-3,3,1]
// 输出：[3,1]
// 提示：答案 [1,2,1] 也是正确的。
// 示例 3：

// 输入：head = [1,2,3,-3,-2]
// 输出：[1]


/**
 *  对于索引差有 sum[j] - sum[i] = 0 那么 sum[i-j] = 0 不包括 sum[i]
 *  创建 fakeHead val为0，没有节点的时候sum为0，防止出现节点中没有0的情况
 *  遍历list，记录每一个 node 的map[sum] = node，如果之前出现过相同值，删除map[sum].next-> cur, 清空其中的map值
 */
function ListNode(val) {
    this.val = val;
    this.next = null;
}

function removeZeroSumSublists (head) {
    let map = {}
    const fakeHead = new ListNode(0)
    fakeHead.next = head
    let cur = fakeHead
    let sum = 0

    while(cur) {
        sum += cur.val
        let same = map[sum]
        if (same) {
            let temp = same.next
            let tempSum = sum
            while (temp !== cur) {
                tempSum += temp.val
                map[tempSum] = null
                temp = temp.next
            }
            same.next = cur.next
            cur = same.next
        } else {
            map[sum] = cur
            cur = cur.next
        }
    }

    return fakeHead.next
}



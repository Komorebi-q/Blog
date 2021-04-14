// https://leetcode-cn.com/problems/sliding-window-maximum/

// 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
// 返回滑动窗口中的最大值。
// O(N)

// 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
// 输出：[3,3,5,5,6,7]
// 解释：
// 滑动窗口的位置                最大值
// ---------------               -----
// [1  3  -1] -3  5  3  6  7       3
//  1 [3  -1  -3] 5  3  6  7       3
//  1  3 [-1  -3  5] 3  6  7       5
//  1  3  -1 [-3  5  3] 6  7       5
//  1  3  -1  -3 [5  3  6] 7       6
//  1  3  -1  -3  5 [3  6  7]      7

/**
 *  deque: 维护一个双向队列，左大右小，储存下标
 *  deque[0] 与当前遍历下标 i 差值 就是视窗的大小，超过 k 就移动 右移deque
 *  队尾值与当前值比较，n >= nums[deque[last]], 弹出尾部， 保证队列大小平衡
 */

function maxSlidingWindow(nums, k) {
    if (!nums || !Array.isArray(nums) || !Array.length) {
        return null
    }

    let deque = []
    let res = []

    for (let i = 0; i < nums.length; i++) {
        let n = nums[i]
        if (i - deque[0] - 1 > k) { // 队首元素不在视窗内
            deque.shift()
        }

        while (deque.length && nums[deque[deque.length - 1]] <= n) {
            // 保持队列大小平衡，使队首始终为视窗最大值
            deque.pop()
        }

        deque.push(i)

        if (i >= k - 1) { // 满足视窗条件
            // 输出最大值
            res.push(nums[deque[0]])
        }
    }
    
    return res
}

let res = maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)
console.log('maxSlidingWindow eg1: ========================> ', res)
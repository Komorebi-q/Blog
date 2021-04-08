// 给定一个整数数组和一个整数 k，你需要找到该数组中和为 k 的连续的子数组的个数。
// 使用前缀和来求解，sum[0...3] - sum[0...1] = sum[2..3]

function subArrSum(nums, target) {
    const map = {
        0: 1,
    }
    let preSum = 0
    let res = 0
    for (const n of nums) {
        preSum += n
        const needSum = preSum - target
        res += map[needSum] || 0
        map[preSum] = map[preSum] ? map[preSum] + 1 : 1
    }

    return res
}
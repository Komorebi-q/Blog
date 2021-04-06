/**
 * 给定一个含有 n 个正整数的数组和一个正整数 target 。

找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。

 */

/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
// O(N)
function minSubArrayLen(target, nums) {
    let numsLen = nums.length

    if (numsLen === 0) {
        return 0 
    }

    let less = 0
    let add = 0
    let maxLen = Infinity
    let sum = 0

    while (add < nums.length) {
        sum += nums[add]
        while (sum >= target) {
            maxLen = Math.min(maxLen, add - less + 1)
            sum -= nums[less]
            less += 1
        }

        add++
    }

    return maxLen === Infinity ? 0 : maxLen
}

function search(arr, n, i = 0) {
    if (arr.length === 0) {
        return -1
    }

    if (arr.length === 1) {
        return arr[0] >= n ? i : -1
    }

    let start = 0
    let end = arr.length - 1
    let mid = Math.floor((start + end) / 2)
    let v = arr[mid]
    
    return n > v ? search(arr.slice(mid+1, end+1), n, i+mid+1) : search(arr.slice(0, mid+1), n, i)
}

function minSubArrayLen1(s, nums) {
    let minLen = Infinity
    let sums = []
    nums.reduce((s, n, i) => {
        let sum = s + n
        sums[i] = sum
        return sum
    }, 0)

    for (let i = 0; i <= nums.length; i++) {
        let target = (sums[i - 1] || 0) + s
        
        let index = search(sums, target)
        index = index - (i-1)
        if (index < 1) { continue }
        minLen = Math.min(minLen, index)
    }

    return minLen === Infinity ? 0 : minLen
}

const res = minSubArrayLen1(4, [1, 4, 4])
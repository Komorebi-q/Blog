// 双指针用法

/**
 * 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。

不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。

 */

function removeDuplicates(arr) {
    let l = 0
    let len = arr.length

    if(len < 2) {return len}

    for (let r = 1; r < arr.length; r++) {
        if (arr[l] === arr[r]) {
            l++
            arr[l] = arr[r]
        }
    }

    return l + 1
}
let nums = [1, 1, 2]


// 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 最多出现两次 ，返回删除后数组的新长度。
// 不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。

function removeDuplicatesMoreTwo(nums = []) {
    if (nums.length < 2) { return nums.length }

    let l = 0

    for (let r = 1; r < nums.length; r++) {
        if (nums[r] === nums[l] || nums[l - 1] !== nums[r]) {
            l += 1
            nums[l] = nums[r]
        }
    }

    return l + 1
}
// 搜索插入位置
// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
// 你可以假设数组中无重复元素。

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function searchInsert(nums, target) {
    let index = -1

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i
        }

        if (nums[i] < target) {
            index = i
        }
    }

    nums.splice(index + 1, 0, target)

    return index + 1
}


// 二分法 比较某一部分的中值，来缩小搜索的范围 O(logN)
function searchInsert1(nums, target) {
    let start = 0
    let end = nums.length - 1
    let mid

    while (start <= end) {
        mid = Math.floor((start + end) / 2)
        let v = nums[mid]
        
        if (v === target) {
            return mid
        } else if (target > v) {
            start = mid + 1
        } else {
            end = mid - 1
        }
    }

    return start
}
// searchInsert1([1,3,5,6],7,)
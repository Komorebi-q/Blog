// 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
// https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/10/22/rainwatertrap.png
// 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
// 输出：6
// 解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 


/**
 * @param {number[]} height
 * @return {number}
 */

// 双指针
function trap (height) {
    if (!Array.isArray(height) || height.length < 3) {
        return 0
    }

    let l = 0
    let r = height.length - 1
    let lMax = height[l] // 左边最大挡板
    let rMax = height[r] // 右边最大挡板
    let res = 0

    while (l < r) {
        const lv = height[l]
        const rv = height[r]

        if (lv < rv) { // 只挪动小值，保证有一个最大挡板与另外一边最大挡板形成水池，之后计算每个底部与小的挡板的差值即可
            res += lMax - lv > 0 ? lMax - lv : 0
            lMax = Math.max(lMax, lv)
            l++
        } else {
            res += rMax - rv > 0 ? rMax - rv : 0
            rMax = Math.max(rMax, rv)
            r--
        }
    }

    return res
}

/**
 *  单调栈
 *  低挡板和高挡板可以形成储水池，索引差-1就是宽度， 高度差就是高度，相乘就是储水量
 *  [4, 3, 2, 1] 只要再有一个大于最后一个元素高度的挡板就可以储水
 *  之后弹出元素，计算储水量（w*h）
 *  如果未遇到就没有储水量
 *  
 *  当只有一个低挡板遇到一个高挡板时，不能储水同时低挡版失去作用
 *  
 *  维护一个单调递减栈
 *  - 栈有一个元素 遇到一个大于栈底元素的值，不能储水，弹出栈底元素，新值入栈
 *  - 有多个元素，弹出一个元素，计算当前元素前后挡板的差值，乘以宽度计算出储水量
 *  - 循环 
 *  - 有多个元素计算储水量
 *  - 只有一个元素时，对比能不能储水（小于栈底元素），能 -> 入栈，不能 -> 代替栈底元素
 * */ 

function trap1(height) {
    if (!Array.isArray(height) || height.length < 3) {
        return 0
    }

    let res = 0
    let stack = [] // 保存索引，计算 top 到当前元素相距多少
    let last

    for (let i = 0; i < height.length; i++) {
        let h = height[i]
        last = height[stack[stack.length - 1]]

        while (stack.length && h > last) {
            const top = height[stack.pop()] // 当前操作索引
            if (!stack.length) { // 当h大于栈底元素，清空栈
                break
            }

            // h 右挡板 last 左挡板, 小的挡板形成高度，索引差形成宽度，可计算出储水量
            const left = stack[stack.length - 1]
            last = height[left]
            const min = Math.min(last, h)
            res += (min - top) * (i - left - 1)
        }

        stack.push(i) // push 元素，单调递减
    }

    return res
}

const res = trap

console.log('trap ========================> ', trap1([0,1,0,2,1,0,1,3,2,1,2,1]))
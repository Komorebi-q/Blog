/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
    if (!heights || heights.length === 0) {
        return 0
    }
    
    let stack = []
    let max = 0

    for (let i = 0; i <= heights.length; i++) {
        let h = i === heights.length ? -1 : heights[i]
        
        while(stack.length && h <= heights[stack[stack.length - 1]]) {
            let top = stack.pop()
            let curH = heights[top]
            let right = i - 1
            let left = (stack.length ? stack[stack.length - 1] : 0) + 1
            console.log(' ========================> ', left, right,)
            let w = right - left + 1
            max = Math.max(max, w * curH)
        }
        stack.push(i)
    }

    return max
};

largestRectangleArea([1])
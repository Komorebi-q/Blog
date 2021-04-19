// 给定一个仅包含 0 和 1 、大小为 rows x cols 的二维二进制矩阵，找出只包含 1 的最大矩形，并返回其面积。
// https://assets.leetcode.com/uploads/2020/09/14/maximal.jpg
// https://leetcode-cn.com/problems/maximal-rectangle/

function maximalRectangle(matrix) {
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
        return 0
    }

    const heights = []

    for (let col = 0; col < matrix.length; col++) {
        heights[col] = []
        for (let row = 0; row < matrix[col].length; row++) {
            const v = Number(matrix[col][row])
            
            if (col === 0) {
                heights[col][row] = v > 0 ? 1 : 0
            } else {
                const prevHv = Number(heights[col - 1][row])
                heights[col][row] = v > 0 && prevHv > 0 ? prevHv + 1 : v
            }
        }
    }

    let max = 0
    
    for (let col = 0; col < heights.length; col++) {
        max = Math.max(max, getMaxArea(heights[col]))
    }
    
    return max
}








99





function getMaxArea(heights) {
    if (!heights || !Array.isArray(heights) || heights.length === 0) {
        return 0
    }

    let max = 0
    let stack = []
    for (let row = 0; row <= heights.length; row++) {
        const v = row === heights.length ? -Infinity : heights[row]
        if (!stack.length || heights[stack[stack.length - 1]] <= v) {
            stack.push(row)
        } else {
            while (heights[stack[stack.length - 1]] > v) {
                const h = heights[stack.pop()]
                const curPeek = stack[stack.length - 1]
                let w = curPeek === undefined ? row : row - curPeek - 1 
                max = Math.max(max, w * h)
            }

            if (v !== -Infinity) {
                stack.push(row)
            }
        }
    }

    return max
}


let res = maximalRectangle([["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]])
// maximalRectangle([[1]])


console.log('res ========================> ', res)
/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
// 暴力解法
function leastInterval(tasks, n) {
    if(!tasks) {
        return null
    }

    if (n === 0) {
        return tasks.length
    }

    const runMap = {}
    const taskMap = {}

    for (let task of tasks) {
        taskMap[task] = taskMap[task] ? taskMap[task] + 1 : 1
    }
    let nowTasks = Object.keys(taskMap)
    let i = 1

    while (nowTasks.length !== 0) {
        for (const runTask of Object.keys(runMap)) {
            if (i - runMap[runTask] >= n+1) {
                runMap[runTask] = -1
            }
        }

        let runArr = Object.entries(taskMap).sort((x, y) => x[1] - y[1] >= 0 ? -1 : 1)
        for (let task of runArr) {
            task = task[0]
            if (runMap[task] === undefined || runMap[task] < 0) {
                runMap[task] = i

                if (taskMap[task] <= 1) {
                    delete taskMap[task]
                } else {
                    taskMap[task] -= 1
                }
                break
            }
        }

        nowTasks = Object.keys(taskMap)
        if (!nowTasks.length) {
            return i
        } else {
            i += 1
        }
    }
}

function leastInterval1(tasks, n) {
    if (!tasks) {
        return null
    }

    if (n === 0) {
        return tasks.length
    }

    const taskMap ={}
    for (let task of tasks) {
        taskMap[task] = taskMap[task] ? taskMap[task] + 1 : 1
    }
    let runTaskArr = Object.entries(taskMap).sort((x, y) => x[1] - y[1] >= 0 ? -1 : 1)
    const timeArea = new Array(runTaskArr[0][1]).fill(1).map(() => {
        const arr = new Array(n + 1)
        arr[0] = true

        return arr
    })
    
    let i = 0
    let j = 1
    for (let [k, v] of runTaskArr.slice(1)) {  
        while (v > 0) {
            console.log(' ========================> ', i, j)
            timeArea[i][j] = true
            if (i === timeArea.length - 1) {
                i = 0
                j += 1
            } else {
                i += 1
            }

            v -= 1
        }
    }

    console.log('timeArea========================> ', timeArea)
    const emptyLen = (n + 1- timeArea[timeArea.length-1].filter(Boolean).length)

    return timeArea.length * (n+1) - emptyLen
}

console.log(' ========================> ', leastInterval1(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2))
// console.log(' ========================> ', leastInterval1(["A","A","A","B","B","B"],2))

let industry_list = [{
    "parent_ind": "女装",
        "name": "连衣裙"
    },
    {
        "name": "女装"
    },
    {
        "parent_ind": "女装",
        "name": "半身裙"
    },
    {
        "parent_ind": "女装",
        "name": "A字裙"
    },
    {
        "name": "数码"
    },
    {
        "parent_ind": "数码",
        "name": "电脑配件"
    },
    {
        "parent_ind": "电脑配件",
        "name": "内存"
    },
    {
        "parent_ind": "电脑配件",
        "name": "女装"
    },
]

function getInfo(k) {
    const keys = k.split('_')

    return {
        parent: keys[0],
        child: keys[1],
        index: keys[2]
    }
}

function transfer(arr, map = {}) {
    if (!transfer.cache) {
        transfer.cache = []
        transfer.index = 0
    }

    const next = []
    const data = []
    
    for (const v of arr) {
        const isInitData = transfer.index === 0 && !v.parent_ind
        const isChildData = transfer.cache.filter(k => k.includes(`${v.parent_ind}_${transfer.index -1}`)).length && transfer.index !== 0

        if (isInitData) {
            map[v.name] = {}
            transfer.cache.push(` _${v.name}_${transfer.index}`)
        } else if (isChildData) {
            data.push(v)
        } else {
            next.push(v)
        }
    }

    for (const v of data) {
        const parentIds = []
        let child = v.parent_ind
        let i = transfer.index - 1

        while (i >= 0) {
            let parent = transfer.cache.filter(k => {
                return k.includes(`${child}_${i}`)   
            })[0]

            if (!parent) {
                break
            }

            const info = getInfo(parent)

            if (info.child) {
                parentIds.unshift(info.child)
            }

            child = info.parent
            i -= 1
        }

        let target = map
        for (const parentId of parentIds) {
            target = target[parentId]
        }

        target[v.name] = {}

        transfer.cache.push(`${v.parent_ind}_${v.name}_${transfer.index}`)
    }

    if (next.length) {
        transfer.index += 1
        return transfer(next, map)
    } else {
        transfer.cache = []
        transfer.index = 0

        return map
    }
}

function transferChainStyle(arr, map = {}) {
    if (!transferChainStyle.cache) {
        transferChainStyle.cache = {}
    }

    const next = []
    const data = []
    
    for (const v of arr) {
        const isInitData = !v.parent_ind
        const isChildData = transferChainStyle.cache[v.parent_ind]

        if (isInitData) {
            map[v.name] = {}
            transferChainStyle.cache[v.name] = {
                id: v.name,
                parent: null,
                child: null,
            }
        } else if (isChildData) {
            data.push(v)
        } else {
            next.push(v)
        }
    }

    for (const v of data) {
        const parentIds = [v.parent_ind]

        let parent = transferChainStyle.cache[v.parent_ind].parent

        while (parent) {
            parentIds.unshift(parent.id)
            parent = parent.parent
        }

        let target = map
        for (const parentId of parentIds) {
            target = target[parentId]
        }

        target[v.name] = {}
        const curCache = {
            id: v.name,
            parent: transferChainStyle.cache[v.parent_ind],
            child: null,
        }
        transferChainStyle.cache[v.parent_ind].child = curCache
        transferChainStyle.cache[v.name] = curCache
    }

    if (next.length) {
        transferChainStyle.index += 1
        return transferChainStyle(next, map)
    } else {
        transferChainStyle.cache = []
        transferChainStyle.index = 0

        return map
    }
}

var res = transferChainStyle(industry_list)

console.log('res', res)

function chooseSort(arr = []) {
    for (let i = 0; i < arr.length; i++) {
        let target = arr[i]
        let index = i

        for (let j = i + 1; j < arr.length; j++) {
            let cur = arr[j]

            if (cur < target) {
                index = j
            }
        }

        [arr[i], arr[index]] = [arr[index], arr[i]]
    }

    return arr
}

// less N
// exch pow(N, 2)/2
// O(N) =  pow(N, 2)/2 + N
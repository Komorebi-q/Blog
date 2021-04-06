function Task(x) {
    return {
        map: (f) => new Task(f(x))
    }
}


function main() {
    new Task(1)
        .map(x => {
            console.log('step 1')
            return x + 1
        })
        .map(x => {
            setTimeout(() => {
                console.log('step 2')
                return x + 2
            })
        })


    console.log('is Step 0')
}

main()
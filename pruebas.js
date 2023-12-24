
const search = (array, element) => {
    let startIndex = 0
    let endIndex = array.length - 1

    while (startIndex <= endIndex){
        let middleIndex = Math.floor((startIndex + endIndex) / 2)

        if (array[middleIndex] === element){
            return middleIndex
        } else if (array[middleIndex] < element){
            startIndex = middleIndex + 1
        } else if (array[middleIndex] > element){
            endIndex = middleIndex - 1
        }
    }

    return -1
}

let array = [1, 2, 3, 4, 5, 6, 7, 8, 9]

console.log(search(array, 20))
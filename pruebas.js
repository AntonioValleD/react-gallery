let exampleObject = {
    name: "John",
    age: 30,
    cars: [
        {name: "Ford", models: ["Fiesta", "Focus", "Mustang"]},
        {name: "BMW", models: ["320", "X3", "X5"]},
        {name: "Fiat", models: ["500", "Panda"]}
    ]
}


for (let item in exampleObject){
    console.log(item)
}


const compareArrays = (array1, array2) => {
    for (let item of array1){
        if (array2.includes(item)){
            return true
        }
    }
    return false
}


let array1 = [1, 2, 3, 4, 41]
let array2 = [45, 10, 32, 41, 5]

console.log(compareArrays(array1, array2))
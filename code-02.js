const { compose } = require('lodash/fp')
const fp = require('lodash/fp')

//练习1
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
// const cars = [
//     {in_stock:true},
//     {in_stock:false}
// ]
// console.log(isLastInStock(cars))

//练习2
let getFirstCarName = fp.flowRight(fp.prop('name'), fp.first)
// const cars = [
//     {name:"car1"},
//     {name:"car2"}
// ]
// console.log(getFirstCarName(cars))

let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs)/ xs.length
}

//练习3
let averageDollarValue = compose(_average, fp.map(fp.prop('dollar_value')))
// const cars = [
//     {dollar_value:10},
//     {dollar_value:20}
// ]
// console.log(averageDollarValue(cars))

//练习4
let _underscore = fp.replace(/\W+/g,'_')
let sanitizeNames = fp.flowRight(fp.map(fp.flowRight(fp.lowerCase,_underscore)))
// const names = [
// "Hello World"
// ]
// console.log(sanitizeNames(names))
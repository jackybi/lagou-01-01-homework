const { map } = require('lodash/fp')
const fp = require('lodash/fp')
const _ = require('lodash')
const {Container, Maybe} = require('./support')
let maybe = Maybe.of([5,6,11])
//练习1
let ex1 = _.curry(function(y,x) {
    return fp.map(fp.add(y))(x)
})
// console.log(maybe.map(ex1(3))._value)

//练习2
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = fp.first
// console.log(xs.map(ex2)._value)

//练习3
let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = {id:2, name: 'Albert'}
let ex3 = (user) => {
    return safeProp('name')(user).map(x => fp.first(x))._value
}
// console.log(ex3(user))

//练习4
let ex4 = function (n) {
    return Maybe.of(n).map(x => parseInt(x))._value
}
// console.log(ex4('12'))
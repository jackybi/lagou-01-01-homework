//三个状态
const PENDING = 'pending'
const FULLFILLED = 'fullfilled'
const REJECTED = 'rejected'

class MyPromise {
    status = PENDING
    res = undefined
    err = undefined

    successCallback = []
    failedCallback = []
    
    //构造函数中立即运行传入的异步任务
    constructor (func) {
        func()
    }

    // 异步任务在适当的时候运行此方法来告知Promise运行成功并传入结果
    resolve (value) {
        // 确保状态只改变一次
        if (this.status !== PENDING) 
            return;
        this.status = FULLFILLED
        this.value = value
        // 调用所有的成功回调
        while (this.successCallback.length){
            this.successCallback.shift()()
        }
    }

    // 异步任务或者Promise自己在适当的时候运行此方法来告知Promise运行失败并传入原因
    reject (err) {
        if (this.status !== PENDING) 
            return;
        this.status = REJECTED
        this.err = err
        // 调用所有的失败回调
        while (this.failedCallback.length){
            this.failedCallback.shift()()
        }
    }

    // then, 参数为一个callback 参数，此方法将在 resolve 方法被调用后调用。then 方法同时也返回一个新的Promise 对象方便链式调用
    then (successCallback,failedCallback) {
        successCallback = successCallback ? successCallback : value => value
        failedCallback = failedCallback ? failedCallback : value => value
        let nextPromise = new MyPromise((resolve, reject) => {
            if (this.status === FULLFILLED) {
                // 此处与后面的setTimeout 是为了异步获取创建的nextPromise，同步的情况下因为对象还未创建会出错
                setTimeout(() => {
                    try {
                        let thenRes = successCallback(this.value)
                        resolvePromise(nextPromise, thenRes, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                },0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let thenRes = failedCallback(this.err)
                        resolvePromise(nextPromise, thenRes, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                },0)
            } else {
                // 状态为Pending 时将回调函数推入栈中，每个回调函数需要按照上面的方式包装
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let thenRes = successCallback(this.value)
                            resolvePromise(nextPromise, thenRes, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    },0)
                })
                this.failedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let thenRes = failedCallback(this.err)
                            resolvePromise(nextPromise, thenRes, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    },0)
                })
            }
        })
        return nextPromise
    }

    // 此方法在Promise 链式调用结束时无论结果都会运行回调函数，同时也返回一个新的Promise 并传入运行结果
    finally (callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value )
        }, err => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    }

    // 仅用来获取错误，所以只需要传入错误回调
    catch (failedCallback) {
        return this.then(undefined, failedCallback)
    }

    // 多个方法或者Promise并行运行，传入数组中值如果不是Promise 则直接放入结果数组中，是Promise则将Promise结果放入结果中
    static all (array) {
        let res = []
        let count = 0
        return new MyPromise((resolve, reject) => {
            function addData (key, value) {
                res[key] = value
                count ++
                // 所有的任务完成后才resolve
                if (count === array.length) {
                    resolve(res)
                }
            }
            for (let i = 0; i< array.length; i++) {
                let task = array[i]
                if (task instanceof MyPromise) {
                    task.then(value => addData(i, value), err => reject(err))
                } else {
                    addData(i, array[i])
                }
            }
        })
    }

    // 静态方法，直接调用时判断value是否为Promise，是则直接返回，不是则创建Promise并将value传给后续的链式方法
    static resolve (value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }
}


// 此函数用来处理then中的回调返回值，如果是Promise 且不是自身的话则调用此Promise 的then 方法并传入原先的 resolve 与 reject 回调，如果是其它值则直接调用 resolve回调
function resolvePromise (nextPromise, thenRes, resolve, reject) {
    // 当返回的Promise与自身相同则报错
    if (nextPromise === thenRes) {
      return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (thenRes instanceof MyPromise) {
      // then promise 对象
      thenRes.then(resolve, reject);
    } else {
      // 普通值
      resolve(thenRes);
    }
}
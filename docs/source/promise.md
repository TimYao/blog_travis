## promise

- Promise.all

  ```js
    function all(arr) {
      if (!Array.isArray(arr)) {
        arr = [arr];
      }
      let index = 0;
      let result = [];
      function collectResult(v, resolve) {
        result[index++] = v;
        if (index === arr.length) {
          resolve(result);
        }
      }
      return new Promise((resolve, reject) => {
        arr.forEach((item) => {
          Promise.resolve(item).then((v) => {
            collectResult(v, resolve);
          }, (e) => {
            reject(e);
          })
        })
      })
    }
    let res = [
      Promise.reject('error1'),
      Promise.resolve('222')
    ]
    all(res).then((v) => {
      console.log(v);
    }).catch((e) => {
      console.log(e);
    })
  ```

- Promise.race

  ```js
    function race () {
      if (!Array.isArray(arr)) {
        arr = [arr];
      }
      return new Promise((resolve, reject) => {
        arr.forEach((item) => {
          Promise.resolve(item).then(resolve, reject);
        })
      })
    }
    let res = [
      Promise.reject('error1'),
      Promise.resolve('222')
    ]
    race(res).then((v) => {
      console.log(v)
    }).catch((e) => {
      console.error(e);
    })
  ```

- Promise.prototype.finally

  ```js
    Promise.prototype.finally = function(fn) {
      return this.then((v) => {
        return Promise.resolve(fn()).then(v=>v)
      }, (e) => {
        return Promise.resolve(fn()).then(null, (e)=>throw e)
      })
    }
  ```

- Promise.any

 ```js
    function any(arr) {
      if (!Array.isArray(arr)) {
        arr = [arr];
      }
      let index = 0;
      let result = [];
      function collectError(e, i, reject) {
        result[index++] = e;
        if (index === arr.length) {
          reject(result);
        }
      }
      return new Promise((resolve, reject) => {
        arr.forEach((item, i) => {
          Promise.resolve(item).then(resolve, (e) => {
            collectError(e, i, reject);
          })
        })
      })
    }
    let res = [
      Promise.reject('error1'),
      Promise.resolve('222')
    ]
    any(res).then((v) => {
      console.log(v);
    }).catch((e) => {
      console.log(e)
    });
 ```

 - Promise.allSettled

 ```js
    function allSettled(arr) {
      if (!Array.isArray(arr)) {
        arr = [arr];
      }
      let index = 0;
      let result = [];
      function collectResult(e, resolve) {
        result[index++] = e;
        if (index === arr.length) {
          resolve(result);
        }
      }
      return new Promise((resolve, reject) => {
        arr.forEach((item) => {
          Promise.resolve(item).then(v) => {
            collectResult(v, resolve);
          }, (e) => {
            collectResult(e, resolve);
          })
        })
      })
    }
    let res = [
      Promise.reject('error1'),
      Promise.resolve('222')
    ]
    allSettled(res).then((v) => {
      console.log(v);
    }).catch((e) => {
      console.log(e)
    });
 ```
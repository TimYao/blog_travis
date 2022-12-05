// async function t1() {
//   console.log('t1')
// }
// async function t2() {
//   console.log('t2');
//   return Promise.resolve('tt2');
// }
// async function t3() {
//   console.log('t3');
//   return Promise.resolve('tt3');
// }
// new Promise(async (resolve, reject)=>{
//   try{
//     // await t1s();
//     console.log('a');
//     //return true;
//   }catch(e){
//     console.log('error', e);
//     //return true;
//     // await t2();
//   }finally{
//     console.log('finally');
//     return true;
//   }
//   // await t3();
// })
let obj = {
  data: {
    a: '原值'
  },
  watch: {
    'a': function(n, o) {

    }
  }
};
let userWatcher = {};
let target;
let watcherId = 0;
let dep = {};
function observerData() {
  let data = obj.data;
  Object.keys(data).forEach((key) => {
    Object.defineProperty(obj, key, {
      get: function() {
        return data[key];
      },
      set: function(n) {
        data[key] = n;
      }
    })
  })
}
function watcherData() {
  let watch = obj.watch;
  function transToFun(key) {
    return function() {

    }
  }
  Object.keys(watch).forEach((key) => {
    userWatcher[watcherId++] = {
      exOrFn: transToFun(key),
      cb: watch[key]
    }
  })
}
observerData();
watcherData();
console.log(obj.a);


// function deepCopy(obj, m = new Map()) {
//   if (m.has(obj)) {
//     return obj;
//   }
//   const baseType = ['number', 'string', 'boolean', 'null', 'undefined', 'symbol'];
//   if (baseType.indexOf(typeof obj) > -1) {
//     return obj;
//   }
//   if (obj instanceof Function) {
//     return obj;
//   }
//   if (obj instanceof RegExp) {
//     return new RegExp(obj);
//   }
//   if (obj instanceof Date) {
//     return new Date(obj);
//   }
//   let o = new obj.constructor();
//   m.set(obj, true);
//   Object.keys(obj).forEach((item) => {
//     o[item] = deepCopy(obj[item], m);
//   })
// }

function create(obj) {
  function F() {
  }
  F.prototype = obj;
  return new F();
}
// object.create({a:1});

function stance(a, b) {
  let __proto = Object.getPrototypeOf(a);
  let _ctor = b.prototype;
  let flg = false;
  while(true) {
    if(__proto === _ctor) {
      flg = true;
      break;
    }
    __proto = Object.getPrototypeOf(__proto);
  }
  return flg;
}
//stance()

function news(f, ...arg) {
  // function F() {
  //   f.apply(this, arg);
  // }
  // F.prototype = f.prototype;
  // return new F();
  let o = Object.create(null);
  Object.setPrototypeOf(o, f.prototype);
  let re = f.apply(o, arg);
  typeof re !== 'object' ? o : re;
}
// news

function throttle1(f, wait) {
  let prev = 0;
  return function() {
    let ctx = this;
    let nTime = Data.now();
    if (nTime-prev > wait) {
      f.apply(ctx, [...arguments]);
    }
    prev = nTime;
  }
}
function throttle2(f, wait) {
  let t;
  return function() {
    if (t) return;
    let ctx = this;
    let fn = ()=>{
      f.apply(ctx, [...arguments])
      clearTimeout(t);
      t = null;
      fn();
    };
    t = setTimeout(fn, wait);
  }
}
// throttle

// console.log(Object.prototype.toString.call(null).slice(1,-1).split(' ')[1].toLowerCase());

function calls() {
  let args = [...arguments];
  let ctx = args.shift() || window;
  let fn = this;
  let key = Symbol('calls');
  ctx[key] = fn;
  ctx[key](...args);
  delete ctx.key;
}
// fn.calls()
function applys() {
  let args = [...arguments];
  let ctx = args.shift() || window;
  let fn = this;
  let key = Symbol('calls');
  ctx[key] = fn;
  ctx[key](...args);
  delete ctx.key;
}

function myBind() {
  let args = [...arguments];
  let ctx = args.shift();
  let fun = this;
  if (typeof fun !== 'function') return;
  let fn = function() {
    let res = fun.apply(this instanceof fn ? this : ctx, args.concat(...arguments));
    res = typeof res === 'object' ? res : this;
    return res;
  };
  fn.prototype = Object.create(fun.prototype);
  return fn;
}
// fn.myBind();

// wenti yi
function add(n){
  let m = 0;
  let temp = function(n) {
    m += n;
  }
  m +=n;
  temp = {
    toString: function() {
      return m;
    }
  }
  return temp;
}
console.log(add(2)(3));


// Ajax 几个状态查下
function getAjax(options) {
  let {url, method} = options;
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(url, method, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status===200) {
        resolve(this.responseText);
      } else {
        reject(new Error(this.statusText));
      }
    }
    xhr.onerror=function() {
      reject(new Error(this.statusText));
    }
    // xhr.setRequestHeader('Accept', 'application/json')
    xhr.send(null);
  })
}
// getAjax({url: '', method: 'get'});

// 随机数
function randomArr() {
  let arr = [3,4,2,5,0,8];
  let i=0; // 1-5 2-5 3-5
  while(i) {
    let currentNum = arr[i];
    let r = Math.ceil(Math.random()*5);
  }
}

function arrs(arr) {
  let i=0;
  let res = [];
  while(i<arr.length) {
    if (typeof arr[i] !== 'object') {
      res.push(arr[i]);
    } else {
      let r = arrs(arr[i]);
      res = res.concat(r);
    }
    i++;
  }
  return res;
}
// console.log(arrs([4,6,[2,[1]]]))

function redarr(arr) {
  return arr.reduce((prev, item) => {
    return prev.concat(Array.isArray(item) ? redarr(item): item);
  }, []);
}
// console.log(redarr([4,6,[2,[1]]]))

// Array.prototype._push = function() {
//   for(let i =0; i<arguments.length;i++) {
//     this[this.length] = arguments[i]
//   }
//   return this.length;
// }
// console.log([4,2]._push(9));

// function repeat(str, n){
//   return new Array(Math.floor(n)).fill(str).join('');
// }
// console.log(repeat('s',1.2));



function tree() {
  const source = [{
    id: 1,
    pid: 0,
    name: 'body'
  }, {
    id: 2,
    pid: 1,
    name: 'title'
  }, {
    id: 3,
    pid: 2,
    name: 'div'
  }];
  let result = [];
  const map = new Map();
  source.forEach((item)=>{
    map[item.id] = item;
  })
  source.forEach((item) => {
    let pid = item.pid;
    let parent = map[pid];
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(item);
    } else {
      result.push(item)
    }
  })
  console.log(JSON.stringify(result, null, 2));
}
// tree();
function cycleObj() {
  let obj = {
    a:{
      b:1
    }
  };
  obj.c = obj.a;
  function isCycle(obj, parentArr) {
    parentArr = [obj];
    let flg = false;
    for(let a in obj) {
      if(typeof obj[a] === 'object') {
        if (parentArr.indexOf(obj[a])>-1) {
          flg = true;
          break;
        }
        parentArr.push(obj[a]);
      }
    }
    return flg;
  }
  console.log(isCycle(obj));
}
cycleObj();

// 思考
var lengthOfLongestSubstring = function (s) {
  let map = new Map();
  let i = -1
  let res = 0
  let n = s.length
  for (let j = 0; j < n; j++) {
      if (map.has(s[j])) {
          i = Math.max(i, map.get(s[j]))
      }
      res = Math.max(res, j - i)
      map.set(s[j], j)
  }
  return res
};



function resolvePromise(promise2, x, resolve, reject) {
  if(x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }
  let called = false;
  if((typeof x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if(called) return
          called = true;
          resolvePromise(promise2, y, resolve, reject)
        }, (r)=>{
          if(called) return;
          called = true;
          reject(r);
        })
      } else {
        resolve(x);
      }
    }catch(e) {
      if(called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}
const PENDING = 'pending';
const RESOLVE = 'resolve';
const REJECT = 'reject';
class Promise {
  constructor(execute) {
    this.value = undefined;
    this.reason = undefined;
    this.resolves = [];
    this.rejects = [];
    this.state = PENDING;

    const resolve = function(v) {
      if (v instanceof Promise) {
        return v.then(resolve, reject);
      }
      if (this.state === PENDING) {
        this.state = RESOLVE;
        this.value = v;
        this.resolves.length > 0 && exeFun(this.resolves)
      }
    }
    const reject = function(r) {
      if (this.state === REJECT) {
        this.state = REJECT;
        this.reason = r;
        this.rejects.length > 0 && exeFun(this.rejects)
      }
    }

    function exeFun(fun) {
      fun.forEach((fn) => {
        fn();
      })
    }
    try {
      execute(resolve, reject);
    }catch(e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    let promise2;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected = typeof onRejected === 'function' ? onRejected : (e) => {throw e;}
    promise2 = new Promise((resolve, reject) => {
      if(this.state === PENDING) {
        setTimeout(() => {
          this.resolves.push(()=>{
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            }catch(e) {
              reject(e);
            }
          })
          this.rejects.push(()=>{
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            }catch(e){
              reject(e);
            }
          })
        })
      }
      if(this.state === RESOLVE) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          }catch(e) {
            reject(e);
          }
        })
      }
      if(this.state === REJECT) {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        }catch(e){
          reject(e);
        }
      }
    })
    return promise2;
  }
}

Promise.prototype.catch = function(fn) {
  return this.then(null, fn)
}
Promise.prototype.finally = function(fn) {
  return this.then((v) => {
    return Promise.resolve(fn()).then(()=>v);
  }, (e) => {
    return Promise.resolve(fn()).then(()=>e)
  })
}
Promise.resolve = function(v) {
  return new Promise((resolve, reject)=>{
    resolve(v);
  })
}
Promise.reject = function(e) {
  return new Promise((resolve, reject)=>{
    reject(e);
  })
}

Promise.all = function(promises) {
  if(!Array.isArray(promises)) promises = [promises];
  let result = [];
  let l = 0;
  function processData(item, i, resolve) {
    if (l >= result.length) {
      return resolve(result);
    }
    result[i] = item;
    l++;
  }
  return new Promise((resolve, reject) => {
    promises.forEach((item, i) => {
      if (item instanceof Promise) {
        item.then((v) => {
          processData(v, i, resolve);
        }, reject)
      } else {
        processData(item, i, resolve);
      }
    })
  })
}
Promise.race = function(promises) {
  if(!Array.isArray(promises)) promises = [promises];
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      if (promise instanceof Promise) {
        promise.then(resolve, reject)
      } else {
        resolve(promise);
      }
    })
  })
}





const obj = {
  data: {
    a: {
      b: 'bvalue'
    }
  },
  watch: {
    'a.b': function(n, o) {
      console.log('新值：', n, '老值：', o);
    }
  }
};
let watchersAll = {};
let dep = {};
let targetWatcher;
function collectData(data, obj) {
  Object.keys(data).forEach((item) => {
    let value = data[item];
    let children = typeof value === 'object' && (collectData(value, value))
    Object.defineProperty(obj, item, {
      get: function() {
          if (targetWatcher) {
            dep[item] = targetWatcher;
          }
          return value;
      },
      set: function(val) {
        if (val === value) return;
        value = val;
        dep[item].cb(val, dep[item].value);
        dep[item].value = val;
      }
    });
  })
}
collectData(obj.data, obj);
function warp(exOrKey) {
  return function() {
    let root = obj;
    let exOrKeys = exOrKey.split('.');
    let key;
    while(key = exOrKeys.shift()) {
      root = root[key];
    }
    return root;
  }
}
function createWatcher(watches) {
  Object.keys(watches).forEach((exOrKey) => {
      watchersAll[exOrKey] = warp(exOrKey);
      watchersAll[exOrKey].cb = watches[exOrKey];
      targetWatcher = watchersAll[exOrKey];
      watchersAll[exOrKey].value = watchersAll[exOrKey]();
      targetWatcher = null;
  });
}
createWatcher(obj.watch);
setTimeout(()=>{
  obj.a.b = 'abc';
}, 1000)



function base64(str) {
  const CHARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let buf = Buffer.from(str);
  let result = '';
  for(let a of buf){
    result += a.toString(2)
  }
  let res = '';
  let n = result.length/6;
  let i = 0;
  while(i<n) {
    res += CHARTS[parseInt(result.slice(i*6, 6+i*6), 2)];
    i++;
  }
  //console.log(res);
  return res;
}
// 5L2g5aW96Iqx6Iqx6K6i5Y2V
base64('你好花花订单');

// ===========这里待理解编码转换问题
function deBase64(code) {
  const CHARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let i = 0;
  let l = code.length;
  let result = '';
  // while(i<l) {
  //    result += (CHARTS.indexOf(code[i]).toString(2));
  //    i++;
  // }
  // result = result.match(/\d{8}/g).map((item)=>{
  //   return String.fromCodePoint(parseInt(item, 2))
  // })
  result = window.atob(decodeURIComponent(code));
  console.log(result,'\n');
}
deBase64('5L2g5aW96Iqx6Iqx6K6i5Y2V');



// function red() {
//   console.log('red');
// }
// function green() {
//   console.log('green');
// }
// function yellow() {
//   console.log('yellow')
// }
// async function start() {
//   await new Promise((resolve, reject)=> setTimeout(()=>resolve(red()), 1000));
//   await new Promise((resolve, reject)=> setTimeout(()=>resolve(green()), 2000));
//   await new Promise((resolve, reject)=> setTimeout(()=>resolve(yellow()), 3000));
//   start()
// }
// start();

// =====================问题二
function add() {
  let args = [...arguments];
  let fn = function  () {
    args.push(...arguments)
    return fn
  }
  fn.prototype.toString = function () {
    return args.reduce((x,y) => x+y);
  }
  return fn
}
console.log(add(1));
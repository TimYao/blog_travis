## 题目集合

- 求一组数据中三个数的乘积最大值

  ```js
    function computeProduct(arr) {
      if (arr.length < 3) throw 'error';
      arr.sort((a, b) => {
        return a-b
      })
      if (arr[0] > 0) {
        // 全正
        return arr[0] * arr[1] * arr[2]
      } else if (arr[1] < 0) {
        // 至少有两个负数
        return arr[0] * arr[1] * arr[arr.length-1]
      } else {
        // 只有一个负数
        return arr[arr.length-1] * arr[arr.length-2] * arr[arr.length-3]
      }
    }
    console.log(computeProduct([2,-2,-3, -1]));
  ```

- 给定一个整数数组，请找出两个元素之间的最大差，较小值的元素必须位于较大元素之前

  ```js
    const array = [7, 8, 15, 9, 20, 3, 1, 10];
    findLargestDifference(array)
    function findLargestDifference(array) {
      const max = Math.max.apply(null, array);
      const i = array.indexOf(max);
      const min = Math.min.apply(null, array.slice(0, i));
      console.log(min, max)
      return {min, max}
    }
  ```

- 回文判断

  思路分析：正序和反序字符都一一相同，对字符进行翻转比对原字符，或者从前后对应比对

  ```js
    function backText(str) {
      let flag = true;
      let l = str.length;
      let i = 0;
      let j = l-i-1;
      while(i!==j && i<=j){
        if(str[i] !== str[j]){
          flag = false;
          break;
        }
        i++;
        j = l-i-1;
      }
      return flag;
    }

  ```

- 千位分割

  ```js
    let s = 0;
    let e = 0;
    let str1 = "10000000000";
    let l1 = str1.length;
    let i = Math.floor(l1/3);
    let k1 = 0;
    let sum = '';
    while(k1<i){
      s = l1-3*(k1+1);
      e = l1-3*(k1+1)+3
      sum = sum ? ','+sum : sum;
      sum=str1.substring(s,e)+sum;
      k1++;
    }
    sum = str1.substring(0, s) + ',' + sum;

    //另一种思路
    function format(n){
      n = n.toString();
      let index = n.indexOf('.');
      let delimiter = index > 0 ? n.slice(index) : '';
      n = n.slice(0, delimiter ? index : n.length).split('');
      let i = 1;
      let l = n.length;
      let result = '' + delimiter;
      while(i<=l) {
        result = n[l-i] + result;
        result = i%3===0 ? (','+result) : result;
        i++;
      }
      console.log(result);
      return result;
    }

    // 正则模式
    function format(n) {
      let reg = /(\d)(?=(\d{3})+$)/g;
      n.replace(reg, function(m, $1) {
        return `${$1},`;
      })
    }
    format('13210');
  ```

- 大数相加

  ```js
    function maxNumSum(n1, n2) {
      if (typeof n1 !== 'string' || typeof n2 !== 'string') {
        n1 = String(n1);
        n2 = String(n2);
      }
      let i = n1.length-1;
      let j = n2.length-1;
      let result = '';
      let temp = 0;
      while(i>=0 || j>=0) {
        let s1 = (+n1[i]);
        let s2 = (+n2[j]);
        if (isNaN(s1)) { s1 = 0;}
        if (isNaN(s2)) { s2 = 0;}
        let sum = s1 + s2 + temp;
        let r = sum > 10 ? (temp = 1, sum%10) : (temp = 0, sum);
        result = r + result;
        i--;
        j--;
      }
      console.log(result);
      return result;
    }
    maxNumSum('24326190', '8932');  // 24335122
  ```

- 素数判断

  ```js
    // 思路：素数也叫质数，只能被1和自己整除，0不是素数
    function su(arr) {
      let result = [];
      arr.forEach((item) => {
        let i = 2;
        let flg = true;
        while(item === 0 || i<=item) {
          if (item%i === 0 && i !== item) {
            flg = false;
            break;
          }
          i++;
        }
        if(flg){
          result.push(item);
        }
      })
      return result;
    }
    su([3, 5, 6, 0 ,12]);
  ```

- 三数之和

  ```js
    function threeToSum(arr) {
      let result = [];
      let su;
      let oMap = new Map();
      let len = arr.length;
      let i = 0;
      let j;

      while(i < len) {
        su = 0;
        let first = arr[i];
        result = [];
        result.push(first);
        su += first;
        let two;
        j = i+1;
        while(two = arr[j]) {
          su = first;
          result = [first];
          result.push(two);
          su += two;
          let last = 0 - su;
          let index = arr.indexOf(last, arr.indexOf(first)+1);
          if (index > -1){
            result.push(last);
          }
          if (result.length === 3) {
            let key = [...result].sort((a,b)=> a-b).toString();
            if (oMap.has(key)) {
              j++;
              continue;
            }
            oMap.set(key, result);
          }
          j++;
        }
        i++
      }
      return [...oMap];
    }
    console.log(threeToSum([3,1,-1,2,-2,0,-3]));
  ```

- 信号量

  ```js
    // 思路： 信号量是一个处理计数量，当信号量有分配时则立即执行发起任务，若没有则先排队存储，等执行任务释放后再继续分配队列任务执行
    class Signal {
      constructor(options) {
        this.signal = options.signal || 2;
        this.queue = [];
        this.__continue = this.__continue.bind(this);
      }
      take(fn) {
        if (this.signal > 0) {
          this.signal--;
          fn();
        } else {
          this.queue.push(fn);
        }
      },
      done() {
        this.signal++;
        if (this.queue.length > 0) {
          process.nextTick(this.__continue);
        }
      }
      __continue() {
        if (this.signal > 0) {
          if (this.queue.length > 0) {
            this.signal--;
            let fn = this.queue.pop();
            fn && fn();
          }
        }
      }
    }
    let signal = new Signal(2);
    signal.take(function(){
      console.log('single one');
      this.done();
    });
    signal.take(function(){
      console.log('single two');
      this.done();
    })
    signal.take(function(){
      console.log('single three');
      this.done();
    })
  ```

- watch观测

  ```js
    /*
      思路：
      1. 建立数据对象的数据劫持，并代理至原对象上(Object.defineProperty)
      2. 建立每一个watcher对象，并记录cb，对象观测数据的封装函数
         例如：watcherObj = {
                              cb,
                              fn()=>{
                                对obj.a.b的封装执行函数
                              }
                           }
      3. 建立全局变量记录当前watcher,为了再触发watcher.fn时建立数据收集到对应watcher,在之后的数据set变更后进行通知收集watcher中fn执行，并执行cb将数据值的变化传入
    */
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
  ```

- 计算属性

  ```js
    // 思路：对computed对象属性建立对应computed watcher,并劫持属性get,set方法重新，将劫持方法绑定到对应watcher中，并填入dirty属性记录是否延迟执行判断标识，重写get时执行watcher调用老get进行执行，并配置为当前watcher，将dirty置为true,同时，劫持data重新属性在get中进行收集当前watcher,建立了data下属性与计算watcher之间的收集关系，当data下属性调用执行，在对应的set下进行将dirty置为false,并模拟模板渲染进行后面重新读取计算属性
    let obj = {
      data: {
        a: '原值'
      },
      computed: {
        first: function() {
          return this.a;
        }
      }
    }
    let target;
    let data = obj.data;
    let computed = obj.computed;
    let dep = {};
    let watcher = {};
    function observerData() {
      Object.keys(data).forEach((key) => {
        Object.defineProperty(obj, key, {
          get: function() {
            if (target) {
              dep[key] = target;
            }
            return data[key];
          },
          set: function(nValue) {
            data[key] = nValue;
            if (dep[key]) {
              dep[key].dirty = false;
            }
          }
        })
      })
    }
    function watcherData() {
      Object.keys(computed).forEach((key) => {
        watcher[key] = computed[key];
        watcher[key].dirty = false;
        Object.defineProperty(obj, key, {
          get: function() {
            target = watcher[key];
            if (target.dirty) {
              return target.value;
            }
            target.dirty = true;
            target.value = target.call(obj);
            return target.value;
          },
          set: function() {
            throw new Error('error');
          }
        })
      })
    }
    observerData();
    watcherData();
    console.log(obj.first);
    setTimeout(function() {
      obj.a = '新值';
      console.log(obj.first);
    }, 1000)
  ```

- 模板引擎

  ```js
    function mb() {
      let str = "{{message}} hello {{name}},ok! {{age}}";
      str = str.replace(/\{\{/g, '"+').replace(/\}\}/g, '+"');
      str = '"' + str + '"';
      let ctx = {
        name: 'Tim',
        age: 12,
        message: 'this is'
      }
      let yj = 'let template;with(this){template='+str+'};return template;';
      let f = new Function(yj);
      let template = f.call(ctx);
      return template;
    }
    console.log(mb());
  ```

- 深度克隆

  ```js
    function deepClone(obj, oMap) {
      const m = oMap || new Map();
      if (m.get(obj)) {
        return obj;
      }
      if (typeof obj !=='object' || typeof obj === 'function' || obj == null) {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj);
      }
      if (obj instanceof RegExp) {
        return new RegExp(obj);
      }
      const o = new obj.constructor();
      m.set(obj, true);
      for (let attr in obj) {
        if (typeof obj[attr] === 'object'){
          o[attr] = deepClone(obj[attr], m);
        } else {
          o[attr] = obj[attr];
        }
      }
      return o;
    }
    const obj = {
      str: 'string',
      num: 123,
      bol: true,
      ob: {
        a: 11,
        ok: {
          ok: 'oks'
        },
        arr: ['arr', 34, true, false],
      },
      fn: function() {console.log('fn');},
      symbol: Symbol('symbol'),
      date: new Date(),
      reg: /\w/,
      n: null,
      und: undefined
    };
    obj.obj = obj;
    const n = deepClone(obj);
    n.ob.arr[0] = 'akk';
    n.symbol = 'ddd';
    // console.log(n, obj);
  ```

- 循环引用

  ```js
    // 思路一：建立对象映射表，每一次递归完成查询比对
    // 思路二: 建立双指针，移动指针完成对比
    // 思路三: 借用JSON.stringify在序列循环引用会报错
    let obj = {
      a: {b: 1}
    };
    obj.c = obj;
    function circle1(obj, circleMap) {
      circleMap = circleMap || new WeakMap();
      circleMap.set(obj, true);
      let flg = false;
      for (let key in obj) {
        let o = obj[key];
        if (typeof o === 'object') {
          if (circleMap.has(o)) {
            flg = true;
            break;
          }
          circle1(o, circleMap);
        }
      }
      return flg;
    }
    console.log(circle1(obj));

    // 模拟指针模式
    function zzCycle(arr) {
      let zz1;
      let i = 0;
      let l = arr.length;
      let flg = false;
      while(i<l) {
        zz1 = 0;
        let n = i+1;
        let current = arr[n];
        while(zz1 < n) {
          if (current === arr[zz1]) {
            flg = true;
            break;
          }
          zz1++;
        }
        if(flg) {
          break;
        }
        i++;
      }
      return flg;
    }
    zzCycle([0, 3, 0, 4, 1]);

    // 利用JSON.stringify
    function circle3(obj) {
      try{
        JSON.stringify(obj);
      }catch(e){
        return true;
      }
    }
  ```

- 生成新的随机数组

 ```js
    // 思路：以random函数完成随机产生索引，调整值位置
    function arrSort(arr) {
      let nwArr = arr.slice();
      let num = arr.length;
      let n = nwArr.length;
      function getRandom(n) {
        let i = Math.ceil(Math.random()*n)-1;
        return i;
      }
      while (n > 0) {
        let i = getRandom(n);
        // if (num-n === i) {
        //   i = getRandom(n);
        // }
        nwArr = nwArr.concat(nwArr.splice(i, 1));
        n--;
      }
      return nwArr;
    }
    arrSort([5,1,0,4,0,2]);
 ```

- 数组拍平

  ```js
    function flatArr(arr) {
      return JSON.parse('[' + arr.toString() + ']');
    }
    function flatArr(arr, result = []) {
      for(let a in arr) {
        if (Array.isArray(arr[a])) {
          flatArr(arr[a], result);
        } else {
          result.push(arr[a]);
        }
      }
      return result;
    }
    console.log(flatArr(['a', ['c','d', ['g']]]));

    // arr.flat(Infinity)
  ```

- 实现一个trim方法

  ```js
    function trim(str) {
      const reg = /^\s*|\s*$/g;
      return str.replace(reg, '')
    }
  ```

- 字符翻转

  ```js
    function strReverse(str) {
      return str.split('').reverse().join('');
    }
  ```

- 数组去重

  ```js
    // set去重
    function arrQc(arr) {
      return [...new Set(arr)];
    }

    // indexOf去重
    function arrQc(arr, result=[]){
      arr.forEach((item)=>{
        result.indexOf(item) === -1 && result.push(item)
      })
      return result;
    }

    // 原数组操作去重
    function arrQc(arr){
      let j=1;
      let i=0;
      let flg = false;
      while(arr[j]) {
        let curr = arr[j];
        while(i>=0){
          let pre = arr[i];
          if (pre==curr) {
            arr.splice(j,1);
            i=j-1;
            flg=true;
            break;
          }
          flg = false;
          i--;
        }
        if (flg) {
          continue;
        }
        i=j;
        j++;
      }
    }
    arrQc([2,3,2,5,8,3])
  ```

- 字符的最短距离

  题目描述

    给定一个字符串 S 和一个字符 C。返回一个代表字符串 S 中每个字符到字符串 S 中的字符 C 的最短距离的数组。


    示例 :
        输入: S = "loveleetcode", C = 'e'
        输出: [3, 2, 1, 0, 1, 0, 0, 1, 2, 2, 1, 0]

    说明:
        - 字符串 S 的长度范围为 [1, 10000]。
        - C 是一个单字符，且保证是字符串 S 里的字符。
        - S 和 C 中的所有字母均为小写字母。

  ```js
    var shortestToChar = function (S, C) {
      if (typeof S !== 'string' || (typeof S === 'string' && (S.length === 0 || S.length > 10000)) || typeof C !== 'string' || (typeof C === 'string' && C.length !== 1)) return;
      if (S.indexOf(C) === -1) return;
      let flagPos = S.indexOf(C);
      let preFlagPos;
      let i = 0;
      let l = S.length;
      let result = [];
      while (i < l) {
        if (i <= flagPos) {
          if (preFlagPos) {
            if (Math.abs(i-preFlagPos) >  Math.abs(i-flagPos)) {
              result.push(Math.abs(flagPos-i));
            } else {
              result.push(Math.abs(i-preFlagPos));
            }
          } else {
            result.push(flagPos-i);
          }
        } else {
          preFlagPos = flagPos;
          flagPos = S.indexOf(C, preFlagPos+1);
          if (flagPos === -1) {
            flagPos = preFlagPos;
          }
          if (Math.abs(i-preFlagPos) > Math.abs(i-flagPos)) {
            result.push(Math.abs(i-flagPos));
          } else {
            result.push(Math.abs(i-preFlagPos));
          }
        }
        i++;
      }
      return result;
    }
    console.log(shortestToChar("loveleetcode", "e"))
  ```

- 字符串解码

  题目描述:
      给定一个经过编码的字符串，返回它解码后的字符串。
      编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
      你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。
      此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。

  示例 1：
      输入：s = "3[a]2[bc]"
      输出："aaabcbc"


  示例 2：
      输入：s = "3[a2[c]]"
      输出："accaccacc"


  示例 3：
      输入：s = "2[abc]3[cd]ef"
      输出："abcabccdcdcdef"


  示例 4：
      输入：s = "abc3[cd]xyz"
      输出："abccdcdcdxyz"

  ```js
    function decodeString(str) {
      // 获取最终结果
      function getResult(stack, result) {
        let value;
        while(value = stack.pop()) {
          result = value + result;
        }
        return result;
      }
      // 重复字符
      function executor(m, str) {
        return str.repeat(m);
      }
      // 完成出栈
      function pop(stack) {
        let str = '';
        let num;
        let value;
        let flg = true;
        while(value = stack.pop()) {
          if (value === '[') {
            flg = false;
            continue;
          }
          if (/[a-zA-Z]/.test(value)) {
            str = value + str;
          } else {
            num = value;
          }
          if (!flg) {
            break;
          }
        }
        return {num, value: str};
      }

      function start() {
        let stack = [];
        let reg = /(\])/;
        let result = '';
        for (let a of str) {
          let matcher = a.match(reg);
          if (matcher && matcher[0]) {
            if (matcher[0] === ']') {
              let {num, value} = pop(stack);
              let last = executor(num, value);
              stack.push(last);
            }
          } else {
            stack.push(a);
          }
        }
        result = getResult(stack, result);
        return result;
      }
      return start();
    }
    decodeString('abc3[cd]xyz');

  ```

- 设计一个支持增量操作的栈

  题目描述：
        请你设计一个支持下述操作的栈。
        实现自定义栈类 CustomStack ：
        CustomStack(int maxSize)：用 maxSize 初始化对象，maxSize 是栈中最多能容纳的元素数量，栈在增长到 maxSize 之后则不支持 push 操作。
        void push(int x)：如果栈还未增长到 maxSize ，就将 x 添加到栈顶。
        int pop()：弹出栈顶元素，并返回栈顶的值，或栈为空时返回 -1 。
        void inc(int k, int val)：栈底的 k 个元素的值都增加 val 。如果栈中元素总数小于 k ，则栈中的所有元素都增加 val 。


    示例：
        输入：
        ["CustomStack","push","push","pop","push","push","push","increment","increment","pop","pop","pop","pop"]
        [[3],[1],[2],[],[2],[3],[4],[5,100],[2,100],[],[],[],[]]
        输出：
        [null,null,null,2,null,null,null,null,null,103,202,201,-1]
        解释：
        CustomStack customStack = new CustomStack(3); // 栈是空的 []
        customStack.push(1); // 栈变为 [1]
        customStack.push(2); // 栈变为 [1, 2]
        customStack.pop(); // 返回 2 --> 返回栈顶值 2，栈变为 [1]
        customStack.push(2); // 栈变为 [1, 2]
        customStack.push(3); // 栈变为 [1, 2, 3]
        customStack.push(4); // 栈仍然是 [1, 2, 3]，不能添加其他元素使栈大小变为 4
        customStack.increment(5, 100); // 栈变为 [101, 102, 103]
        customStack.increment(2, 100); // 栈变为 [201, 202, 103]
        customStack.pop(); // 返回 103 --> 返回栈顶值 103，栈变为 [201, 202]
        customStack.pop(); // 返回 202 --> 返回栈顶值 202，栈变为 [201]
        customStack.pop(); // 返回 201 --> 返回栈顶值 201，栈变为 []
        customStack.pop(); // 返回 -1 --> 栈为空，返回 -1

  对于理解增量的问题，当增量数量大于了数据存储，则对全部数据进行了更新，如果小于，则对指定数量下进行增量更新

  ```js
    var CustomStack = function (maxSize) {
      this.stack = [];
      if (isNaN(Number(maxSize)) || maxSize <=0 || maxSize > 1000) return;
      this.maxSize = maxSize;
    };

    /**
    * @param {number} x
    * @return {void}
    */
    CustomStack.prototype.push = function (x) {
      if (isNaN(Number(x)) || x <=0 || x > 1000) return;
      if (this.stack.length >= this.maxSize) return;
      this.stack.push(x);
    };

    /**
    * @return {number}
    */
    CustomStack.prototype.pop = function () {
      if (this.stack.length === 0) return -1;
      return this.stack.pop();
    };

    /**
    * @param {number} k
    * @param {number} val
    * @return {void}
    */
    CustomStack.prototype.increment = function (k, val) {
      if (this.stack.length === 0) return;
      if (isNaN(Number(k)) || k <=0 || k > 1000) return;
      val = Number(val);
      if (isNaN(val) || val < 0 || val > 100) return;
      const l = this.stack.length;
      let num;
      if (k >= l) {
        num = l;
      } else {
        num = k;
      }
      for (let i = 0; i < num; i++) {
        this.stack[i] = Number(this.stack[i]) + val;
      }
    };

    const custom = new CustomStack(3);
    custom.push(1);
    custom.push(2);
    custom.push(3);
    custom.increment(5, 100);
    custom.increment(2, 100);
    console.log(custom.pop());
    console.log(custom.pop());
    console.log(custom.pop());
    console.log(custom.pop());
    console.log(custom.stack);
  ```

- 完整版本base64编码与解码

  ```js
    function enCodeBase64(str) {
      const CHARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let result = '';
      let byteNum = 0;
      const binaryCode = Buffer.from(str);

      // 完成转码为二进制，并统计字节数
      for(let n of binaryCode) {
          result += n.toString(2).padStart(8, '0');
          byteNum++;
      }

      // 完成6位分割
      let l = result.length;
      let offset = 6;
      let start = 0;
      let re = [];
      while(start < l) {
          re.push(result.slice(start, start + offset));
          start = start + offset;
      }

      // 补充不足位保证为6位
      let baseCode = re.map((val) => {
          val = val.padEnd(6, '0');
          return parseInt(val, 2);
      }).map(val=>CHARTS[val]).join('');

      // 通过计算末尾添加=补充字节位，满足3*8=4*6的对应规则
      const numQuote = 3-(byteNum%3);
      if (numQuote < 3) {
          for(let i=0;i<numQuote;i++){
            baseCode += '=';
          }
      }
      return baseCode;
    }
    console.log(enCodeBase64('ertvxcvcvx'));

    function decodeBase64(baseCode) {
      const CHARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      const quotePos = baseCode.indexOf('=');
      let accCode = baseCode.slice(0, quotePos).split('');

      accCode = accCode.map((code) => {
          return CHARTS.indexOf(code);
      }).map((n) => {
          return n.toString(2).padStart(6, '0');
      }).join('');

      let result = [];
      let start = 0;
      let offset = 8;
      let l = accCode.length;
      while(start < l) {
          result.push(accCode.slice(start, start + offset));
          start = start + offset;
      }
      result = result.map((code) => {
          return code.padStart(8, '0');
      }).map((code) => {
          return String.fromCharCode(parseInt(code, 2));
      }).join('');

      return result;
    }
    console.log(decodeBase64('ZXJ0dnhjdmN2eA=='));


    // 优化版
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
  ```

- 有30个小孩儿，编号从1-30，围成一圈依此报数，1、2、3 数到 3 的小孩儿退出这个圈， 然后下一个小孩 重新报数 1、2、3，问最后剩下的那个小孩儿的编号是多少?

  ```js
    let childNum = function(arr) {
      let iStart = 0;
      let m = new Map();
      arr.forEach((item, index) => {
        m.set(item, index);
      })
      while(arr.length > 1) {
        let index = arr.length >= 3 ? 2 : (iStart=1, 3-arr.length);
        let last = arr.splice(iStart, index);
        let del = arr.shift();
        arr = arr.concat(last);
      }
      console.log(arr[0], m.get(arr[0]));
      return m.get(arr[0]);
    }
    childNum([3,1,4,6,2, 4,7,9,10]);
  ```

- 红灯 3s 亮一次，绿灯 1s 亮一次，黄灯 2s 亮一次；如何让三个灯不断交替重复亮灯？

  ```js
    // 回调完成红绿黄交替执行
    function red() {
      console.log('red');
    }
    function green() {
      console.log('green');
    }
    function yellow() {
      console.log('yellow')
    }

    function start(types,i){
      if (i >= types.length) {i = 0;}
      let [fn, t] = types[i++];
      setTimeout(function(){
        fn();
        start(types, i);
      },t)
    }
    start([[red ,3000], [green, 1000], [yellow, 2000]], 0);

    // promise实现
    function startPromise(types, i) {
      function done() {
        i >= types.length && startPromise(types, 0)
      }
      types.reduce((p, item) => {
        return p.then(function() {
           return new Promise(function(resolve, reject) {
            let [fn, t] = item;
            setTimeout(function() {
              resolve(fn());
              i++;
              done();
            }, t)
          })
        });
      }, Promise.resolve());
    }
    startPromise([[red ,3000], [green, 1000], [yellow, 2000]], 0);

    // async/await
    async function startAsync(types, i) {
      if (i >= types.length) { i=0; }
      await new Promise(function(resolve, reject){
        let [fn, t] = types[i];
        setTimeout(function() {
          resolve(fn());
          i++;
          startAsync(types, i);
        }, t)
      })
    }
    startAsync([[green, 1000], [yellow, 2000], [red ,3000]], 0)
  ```

- 解析 URL Params 为对象

  ```js
    /*
      解析特点：
      1. 对于query中无值参量的处理，排除
      2. 对于query中值编码后需要解码
      3. 对于多值格式以对象或者数组格式处理
    */
    let url = 'http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled';
    parseParam(url);
    function parseParam(url) {
      let params = {};
      let index = url.indexOf('?');
      let search = url.slice(index+1);
      search = search.split('&');
      search.forEach((item) => {
        let [key, value] = item.split('=');
        if (value) {
          value = decodeURIComponent(value);
          let iValue = key.match(/(\w+)\[(\w+)\]/);
          let subKey
          if (iValue) {
            key = iValue[1];
            subKey = iValue[2];
          }
          if (params[key]) {
            if (Array.isArray(params[key])) {
              params[key] = [...params[key], value];
            } else {
              params[key][subKey] = value;
            }
          } else {
            if (subKey) {
              let source;
              if (/\d+/.test(subKey)) {
                source = [];
                source.push(value);
              } else {
                source = {};
                source[subKey] = value;
              }
            } else {
              source = value
            }
            params[key] = source;
          }
        }
      })
      return params;
    }
    parseParam(url);

    function parseParam(url) {
      let params = {};
      let index = url.indexOf('?');
      url = index > -1 ? url.slice(index+1) : url;
      let urlSearch = new URLSearchParams(url);
      for(let [key, value] of urlSearch) {
        value = decodeURIComponent(value);
        if (!value) continue;
        const iValue = key.match(/(\w+)\[(\w+)\]/);
        let subKey;
        if (iValue) {
          key = iValue[1];
          subKey = iValue[2];
        }
        if (params[key]) {
          let source = params[key];
          if (Array.isArray(source)) {
            params[key] = [...source, value];
          } else {
            params[key][subKey] = value
          }
        } else {
          let source
          if (subKey) {
            if (/\d+/.test(subKey)) {
              source = [];
              source.push(value);
            } else {
              source = {}
              source[subKey] = value;
            }
          } else {
            source = value
          }
          params[key] = source;
        }
      }
      return params;
    }

    function parseUrl(url) {
      let index = url.indexOf('?');
      url = index > -1 ? url.slice(index+1) : url;
      return url.split('&').reduce((o, item) => {
        let [key, value] = item.split('=');
        if (!value) {
          return o;
        }
        value = decodeURIComponent(value);
        const reg1 = /(\w+)\[(\w+)\]/;
        const matchItem = key.match(reg1);
        if (matchItem) {
          const subKey = matchItem[2];
          key = matchItem[1];
          if (/\d+/.test(subKey)) {
            o[key] =  o[key] || [];
            o[key].push(value);
          } else {
            o[key] =  o[key] || {};
            o[key][subKey] = value;
          }
          return o;
        }
        o[key] = value;
        return o;
      }, {})
    }

  ```


- n的阶层

 ```js
   // 递归实现
   function fn0(n) {
     if(n===1) return 1;
     return n*fn0(n-1);
   }
   // 尾递归模式
   function fn1(n, s=1) {
     if(n===1) return s;
     return fn1(n-1, n*s);
   }
   console.log(fn1(4));
 ```

- 斐波那契数列

  从第三项开始等于前两项的和, 小于3下返回1,计算第n项值
  1 1 2 3 5

 ```js
   // 递归
   function fn0(n) {
     if(n < 3) {return 1}
     return fn0(n-1)+fn0(n-2);
   }
   fn0(5);

   // 尾递归
   function fn0(n1, n2, n) {
     if(n < 3) {return n1}
     return fn0(n1+n2, n1, n-1);
   }
   fn0(1, 1, 5);

   // 循环
   function fn0(num) {
     let n1 = 1;
     let n2 = 1;
     let n;
     for (let i=3;i<=num;i++) {
       n = n1+n2;
       n2 = n1;
       n1 = n;
     }
   }
   fn0(5);
 ```

- 数组排序

  - 排序题一

    思路整理： 每一次排序都取最大值，将其交叉在左右排列
    ```js
      // 原始数组：arr = [8,0,3,3,5,4,6]
      // 排序后：arr = [3,4,6,8,5,3,0]

      function sortFun(arr) {
        const newArr = [];
        let pos = 0;
        function start() {
          let max = Math.max.apply(null, arr);
          let i = arr.indexOf(max);
          if (Number.isFinite(max)) {
            if (pos === 0 || pos === 1) {
              newArr.push(max);
              pos = -1;
            } else if (pos === -1) {
              newArr.unshift(max);
              pos = 1;
            }
          }
          if (arr.length > 0 && i > -1) {
            arr.splice(i, 1);
            start();
          }
        }
        start();
        console.log(newArr);
      }
      const arr = [8,0,3,3,5,4,6];
      sortFun(arr);
    ```

  - 排序题二

    思路整理：每次取最大值，左右交替插入，左数组进行前插，右数组进行后插

    ```js
      // 原始数组：arr = [3,5,-1,2 ,2,2,9,-7]
      // 排序后：arr = [-1,2,3,9,5,2,2,-7]

      function sortFun (arr) {
        let leftArr = [];
        let rightArr = [];
        let flag = 'left';
        let result = [];
        function start() {
          let max = Math.max.apply(null, arr);
          let i = arr.indexOf(max);
          if (Number.isFinite(max)) {
            if (flag === 'left') {
              leftArr.unshift(max);
              flag = 'right';
            } else if (flag === 'right') {
              rightArr.push(max);
              flag = 'left';
            }
          }
          if (arr.length > 0 && i > -1) {
            arr.splice(i, 1);
            start(arr);
          } else {
            result = leftArr.concat(rightArr);
            return leftArr.concat(rightArr);
          }
        }
        start(arr);
        // 结果为
        // console.log(result);
      }
      const arr = [3,5,-1,2 ,2,2,9,-7];
      sortFun(arr);
    ```


  - 对于非负整数 X 而言，X 的数组形式是每位数字按从左到右的顺序形成的数组。例如，如果 X = 1231，那么其数组形式为 [1,2,3,1]。给定非负整数 X 的数组形式 A，返回整数 X+K 的数组形式。

    示例 1：

        输入：A = [1,2,0,0], K = 34
        输出：[1,2,3,4]
        解释：1200 + 34 = 1234

    示例 2：

        输入：A = [2,7,4], K = 181
        输出：[4,5,5]
        解释：274 + 181 = 455

    ```js
      // 1 <= A.length <= 10000
      // 0 <= A[i] <= 9
      // 0 <= K <= 10000
      // 如果 A.length > 1，那么 A[0] != 0
      var addToArrayForm = function (A, K) {
        if (A.length === 0 || A.length > 10000 || K < 0 || K > 10000) {
          return;
        }
        if (A[0] === 0) {
          return;
        }
        const max = Math.max.apply(null, A);
        if (max > 9) {
          return;
        }
        let val = A.join('');
        if (isNaN(Number(val))) return;
        val = Number(val);
        val = val + K + '';
        val = val.split('');
        val = val.map((item) => Number(item));
        return val;
      }
      const A = [9,9,9,9,9,9,9,9,9,9]; let K = 1
      console.log(addToArrayForm(A, K));
    ```

  - 统计一个数组中和为N的组合有多少个，不包括重复的

    ```js
      function getOrSetEum() {
        const eum = {};
        // 这里还可以通过关联key建立Symbol,保存唯一key,通过Set记录
        return function(a,b) {
          if (a in eum || b in eum) {
            return true;
          }
          eum[a] = b;
          eum[eum[a]] = a;
          return false;
        }
      }
      function start(arr, N) {
        let index = 0;
        let i = -1;
        let l = arr.length;
        const eumFun = getOrSetEum();
        while(i++<l){
          let current = arr[i];
          let other = N-current;
          if (current === other) {
            continue;
          }
          if (arr.indexOf(other) > -1) {
            if (eumFun(current, other) === false) {
              index++;
            }
          }
        }
        return index;
      }
      console.log(start([1,2,3,4,5,6,7,8], 8));
    ```

  - 连接两个有序链表，排序生成生成新链表
    ```js
      var mergeTwoLists = function (list1, list2) {
        const sort = (list1, list2) => {
          let l1 = list1.length;
          let list = list1.concat(list2);
          let l = list.length;
          let i = l1;

          let current;
          while(i<l) {
            current = list[i];
            let j = i;
            while (j>0 && current < list[j-1]) {
              list[j] = list[j-1];
              j--;
            }
            list[j] = current;
            i++;
          }
          return list;
        };

        const links = (list) => {
          let link = {head: null, next: null};
          const createNode = (item) => {
            return {
              el: item,
              next: null
            }
          };
          list.forEach((item) => {
            const node = createNode(item);
            if (!link.head) {
              link.head = node;
            } else {
              link.next.next = node;
            }
            link.next = node;
          })
          return link.head;
        };
        const list = sort(list1, list2);
        const link = links(list);
        return link;
      };
      mergeTwoLists([1,2,4], [1,3,4]);
    ```

## 设计模式

- **设计原则**

  1. 单一职责

     对于一个对象或者函数完成的功能职责唯一性；通过功能的单一性保障了功能不具备过度耦合倒置扩展管理失败。

  2. 最少知识职责

     对于在多个对象下需要建立通信的情况下，交叉通信导致出现网络化，对于通信的信息来源管理随着过多交叉复杂化导致混乱不清晰；通过建立唯一的通信管理对象来解决多对象之间的通信问题。

  3. 开放封闭职责

     对于代码功能的扩展下，在不修改破坏原代码功能下进行扩展，利于多功能职责性组合完成扩展。

  4. 依赖倒置职责（面向接口抽象类编程）

     高层模块不应该依赖低层模块，两者都应该依赖其抽象；抽象不应该依赖细节，细节应该依赖抽象；即模块间不产生依赖实现类，而是应该依赖于抽象，细节化实现依赖抽象

- **模式理解**

  1. 单例模式

     通过保证一个类实例来完成统一性职能

     ```js
        // 简化版本
        // fn 为灵活创建单例的构造函数，在需要不同单例创建下可以传入需求的构造函数
        const SingleModule = function(fn) {
          let instance;
          return function() {
            if (instance) {
              return instance;
            }
            return instance || (instance = new fn(arguments));
          }
        }
     ```

  2. 策略模式

     以多策略完成一个最终目标结果，这里策略可以是多种方式，通过将策略算法各自封装独立，最终委托调用达到最终目标；需要完成对策略算法的封装，以及环境对象实现委托给指定的策略算法执行。

     ```js
       // 简版模式，策略方法方式定义
       const methods = {
         car: function() {
           console.log('坐汽车回家');
         },
         bike: function() {
           console.log('骑自行车回家');
         },
         train: function() {
           console.log('坐火车回家');
         }
       };
       // 场景业务与委托的一种方式
       function goHome(type) {
         return methods[type];
       }
       // 同样可以建立在每一个策略为一个类，场景业务类，通过场景业务类依赖策略类，完成建立，场景业务类内部可以灵活提供切换策略类方法。
     ```

  3. 代理模式

     通过提供一个中间对象来管理对本对象的请求的处理和管理访问，本对象不直接参与与发起者建立联系，通过中间对象完成间接联系；通过代理对象可以完成一些操作例如缓存，劫持，日志监听打印等行为。

     ```js
       // 简版
       const client = {
         sendMessage(target, message) {
           const mess = target.receiver(message);
           console.log(mess);
         }
       };
       const server = {
         receiver(message) {
           return 'server is already receiver the' + message;
         }
       };
       // 代理对象可以起到拦截发起方的操作，进行过滤，监听，规范化行为等
       const proxy = {
         receiver(message) {
           return server.receiver(message);
         }
       };
       client.sendMessage(proxy, 'hello');
     ```

  4. 迭代模式

     迭代模式分为：内迭代与外迭代两种方式；内迭代模式以内部完成封装访问对象的方式，对外只提供了对象内部结果项操作，不暴露操作处理行为；外迭代模式以提供灵活手动控制迭代启动，将操作行为暴露灵活运用。

     ```js
      // 简版 内迭代
      const forEach = function (obj, callback) {
        // 这里完全约束了迭代模式，对外并不知道
        for(let i=0;i<obj.length;i++){
          callback.call(obj, obj[i], i);
        }
      }
      forEach([3,5,1,7], function(item, i) {
        console.log(item, i);
      });

      // 简版 外迭代
      const start = function(obj, callback, finish) {
        let i = 0;
        let l = obj.length;
        const next = function next() {
          if (i>=l) {
            return finish();
          }
          callback(obj[i], i, next);
          i++;
        };
        next();
      }
      start([3,5,1,7], function(item, i, next) {
        console.log(item, i);
        // 手动启动进入下一此迭代；多次next完成最终
        next();
      }, function() {
        console.log('finished!');
      });

      let app = {
        fns:[],
        use(fn){
          this.fns.push(fn);
        },
        run(){
          let l = this.fns.length;
          function next(i=0) {
            if (i>=l) {return;}
            let fn = app.fns[i++];
            fn.call(app, () => next(i))
          }
          next()
        }
      }
      app.use(function(next){
        console.log('1');
        next();
      })
      app.use(function(next){
        console.log('2');
      })
      app.run()
     ```

  5. 发布订阅模式

     由三种角色组合而成，订阅者，发布者，消息管理中心，解耦模块之间的耦合。

     ```js
       // 简版
       const events = {
         list: {},
         listen: function(type, fn) {
           const event = this.list[type] || this.list[type] = [];
           event.push(fn);
         },
         emit: function(type) {
           const event = this.list[type];
           if (!event) return
           let args = Array.prototype.slice.call(arguments);
           args = args.slice(1);
           event.forEach(function(fn){
             fn&&fn(args);
           })
         }
       }
       // 可以通过命名空间的方式实现各对象独立的发布订阅对象
     ```

  6. 命令模式

     命令模式，以请求的发起者，请求的接受者，以及委托对象；通过委托对象将请求发起者发起的请求委托给请求接受者

     ```js
       // 命令的接受者
       const menuCommander = {
         execute: function() {
           console.log('下单了！');
         }
       }
       // 委托对象
       function Order(receiver) {
         this.receiver = receiver;
       }
       // 委托执行
       Order.prototype.execute = function() {
         // 这里可以做一层防护，防护命令对象中没有提供execute方法
         this.receiver.execute();
       }
       const c = new Order(menuCommander)；
       // 发起者
       c.execute();
       // 通过统一了命令的对象执行方式，这样可以更加灵活控制
     ```

     宏命令：一组命令的集合，通过一个操作发起多个执行命令

     ```js
       const commanders = {
         openTv: {
           execute: function() {
             console.log('开启电视');
           }
         },
         loginQQ: {
           execute: function() {
             console.log('登录QQ');
           }
         }
       }
       function Commission(receiver) {
         this.receiver = receiver;
         // 一组命令收集
         this.commanders = [];
       }
       Commission.prototype.addCommander = function(receiver) {
         this.commanders.push(receiver);
       }
       Commission.prototype.execute = function() {
         let i = 0;
         let type;
         // 委托执行
         while(type = this.commanders[i]) {
           this.receiver[type] && this.receiver[type]();
           i++;
         }
       }
       const c = new Commission(commanders);
       c.addCommander('openTv');
       c.addCommander('loginQQ');
       // 发起执行
       c.execute();
     ```

  7. 组合模式

     组合对象即由多个结构相似的对象组合而成一个对象，即部分与整体，多个对象之间形成了树形层次结构，但并不能将根对象完全理解为树根，父子对象之间并不具有继承概念，只是单纯的组合形成一组对象，通过递归执行每一个对象，每一个对象提供相同的执行方法，通过递归调用对象执行方法进行执行。

     ```js
       function Folder() {
         this.parent = null;
         this.files = [];
       }
       Folder.prototype.add = function(file) {
         file.parent = this;
         this.files.push(file);
       }
       Folder.prototype.scan = function() {
         this.files.length > 0 && this.files.forEach(function(file) {
           file.scan();
         })
       }
       function File() {
         this.parent = null;
       }
       File.prototype.add = function() {
         throw new Error('子节点');
       }
       File.prototype.scan = function() {
         console.log('扫描文件');
       }
       const folder = new Folder();
       const file1 = new File(folder);
       folder.add(file1);
       const file2 = new File(folder);
       folder.add(file2);
       folder.scan();

     ```

  8. 模板方法模式

     通过父级定义了子对象的运行算法和执行顺序，父级抽取定义了公共方法，子对象可以重写方法来具体功能化；通过分析父子关系中抽离出抽象公共模式，父级完成不可变的方法属性定义，子级完成重新方法与属性，由父级提供了子级运行算法和执行顺序的方法作为模板方法

     ```js
       function Beverage() {
       }
       Beverage.prototype.boilWater = function() {
         console.log('把水煮沸');
       }
       Beverage.prototype.brew = function() {
         console.log('子类必须重写brew方法');
       }
       Beverage.prototype.purInCup = function() {
         console.log('子类必须重写purInCup方法');
       }
       Beverage.prototype.addCondiments = function() {
         console.log('子类必须重写addCondiments方法');
       }
       // 模板方法
       Beverage.prototype.init = function() {
         this.boilWater();
         this.brew();
         this.purInCup();
         if (this.customAddCondiments()) {
            this.addCondiments();
         }
       }
       Beverage.prototype.customAddCondiments = function() {
         return true;
       }

       function Coffee() {
       }
       Coffee.prototype.brew = function() {
         console.log('用沸水冲咖啡');
       }
       Coffee.prototype.purInCup = function() {
         console.log('将咖啡倒入杯子');
       }
       Coffee.prototype.addCondiments = function() {
         console.log('给咖啡加入糖');
       }
       Coffee.prototype.customAddCondiments = function() {
         return window.confirm('是否加糖');
       };

       const beverage = new Beverage();
       Coffee.prototype = beverage;
       const coffee = new Coffee();
       coffee.init();
     ```

  9. 享元模式

      主要是通过解决多次创建类似结构的对象，减少创建，优化创建对象占用过多内存，通过分析情景进行共享的属性抽离，将外状态属性根据情景将外部状态与共享内部状态进行组合完成场景实例;享元模式主要通过区分内外状态，多个对象抽离出外部状态管理

      对象池概念主要是通过建立共享对象管理存储，对于应用运行从对象池中选取，执行完后归还都对象池，相当于一个共享对象

      ```js
         let id = 0;
         function Upload(uploadType) {
           this.uploadType = uploadType;
         }
         function UploadManage() {
           let uploadManageObj = {};
           return {
             add: function(id, uploadType, file) {
                let flyObj = new UploadFactory.create(uploadType);
                uploadManageObj[id] = {
                  fileName: file.fileName,
                  fileSize: file.fileSize
                }
                return flyObj;
             },
             setExternalState: function(id, flyObj) {
               let uploadData = uploadManageObj[id];
               for(let a in uploadData) {
                 flyObj[a] = uploadData[a];
               }
             }
           }
         }
         function UploadFactory() {
           var uploadObject = {};
           return {
             create: function(uploadType) {
                if (uploadObject[uploadType]) return uploadObject[uploadType];
                return uploadObject[uploadType] = new Upload(uploadType);
             }
           }
         }
         function startUpload(uploadType, files) {
           files.forEach((file) => {
              UploadManage.add(++id, uploadType, file);
           })
         }
         startUpload('plugin', [{
           fileName: '1.txt',
           fileSize: 1000
         }]);

         // 对象池模拟
         function Pond() {
           this.ponds = [];
         }
         Pond.prototype.getPond = function() {
           if (this.ponds.length == 0) return;
           return this.ponds.shift();
         }
         Pond.prototype.revokePond = function(pond) {
           this.ponds.push(pond);
         }
         Pond.prototype.create = function(tool) {
           this.ponds.push(pond);
         }
         function ToolTip(text = 'text') {
           this.text = text;
         }
         let pond = new Pond();
         let toolTip = new ToolTip();
         pond.create(toolTip);
         let tool = pond.getPond();
         console.log(tool.text);
         // 归还
         pond.revokePond(tool);
      ```

  10. 职责链模式

      职责链主要通过在请求者与处理者之间建立一个处理链，每一个处理节点都是一个处理功能，由发起请求者从第一个节点开始传递，直到有处理，这种方式可以通过多个职责功能进行组合形成链来处理请求；通过将每一个节点封装为职责功能函数，通过链函数将各功能组合

      ```js
        function fn1(text) {
          console.log(text);
          return 'next';
        }
        function fn2(text) {
          console.log(text);
          return 'next';
        }
        function Chain(fn) {
          this.fn = fn;
        }
        Chain.prototype.setChain = function(exec) {
          this.nextExec = exec;
        }
        Chain.prototype.requestPass = function() {
          let res = this.fn();
          if (res === 'next') {
            c.nextExec && c.nextExec();
          }
        }
        let c1 = new Chain(fn1);
        let c2 = new Chain(fn2);
        c1.setChain(fn2);
        c1.requestPass();
      ```

  11. 中介者模式

      在多对象之间需要通信时，减少多对象之间的耦合通信，造成信息管理混乱，通过中间对象来管理多对象间通信；容易出现问题是，当管理对象过大过复杂化时导致对象笨重；作为中间对象与其他对象通信的方式可以通过依赖与发布订阅方式通信


  12. 装饰者模式

      通过在不影响原功能的条件下进行扩展添加功能，使两功能间不产生耦合影响又能独立执行相关功能职责；通过扩展功能从继承，混入，组合方式来实现，装饰器模式即组合方式来完成

      ```js
        // 简单理解
        const _slice = Array.prototype.slice;
        Array.prototype.slice = function() {
          // 这里重新增强 切片编程方式
          _slice.apply(this, [...argument])
        }

        // 组合模式进行扩展功能
        Function.prototype.before = function(fn) {
          const self = this;
          return function() {
            fn.apply(self, [...arguments]);
            self.apply(self, [...arguments]);
          }
        }
      ```

  13. 状态模式

      通过状态驱动行为，以封装状态相关行为，并建立业务上下文context，通过将状态对象委托给context上下文业务代码

      ```js
        // 通过建立状态行为对象；也可以将状态封装为类
        const states = {
          on: {
            buttonWasPress:function() {
              console.log('开灯');
              this.currState = this.offState;
            }
          },
          off: {
            buttonWasPress: function() {
              console.log('关灯');
              this.currState = this.onState;
            }
          },
          strong: {
            buttonWasPress: function() {
              console.log('灯加强');
            }
          }
        }
        function delegate(client, delegation) {
          return {
            buttonWasPress: function() {
              return delegation.buttonWasPress.apply(client, arguments);
            }
          }
        }
        function Light() {
          this.button = null;
          this.onState = delegate(this, states.on);
          this.offState = delegate(this, states.off);
          this.currState = this.onState;
        }
        Light.prototype.init = function() {
          const self = this;
          this.button = document.getElementById('btn');
          this.button.onclick = function() {
            self.currState.buttonWasPress();
          }
        }
        const light = new Light();
        light.init();
      ```

  14. 适配模式

      通过外层提供转接适配封装来进行访问原始功能，适配起到了中转功能

      ```js
        function Voltage() {
          this.voltage = '110v';
        }
        Voltage.prototype.visitor = function () {
          console.log(this.voltage);
        }
        function Transit(visitor) {
          this.visitor = visitor;
        }
        Transit.prototype.show = function() {
          return this.visitor.visitor();
        }
        let voltage = new Voltage();
        let transit = new Transit(voltage);
        transit.show();
      ```

- **总结**

  对于分支化逻辑进行函数化转换实现以函数单一职责化功能；

  通过类中的多态方式实现灵活功能化；

  对于全局性污染通过命名空间，iife模式，闭包下私有变量化

  模块下通信规则以模块依赖组合方式，发布订阅方式来实现灵活化


## 数据结构

  数据结构保证数据的管理方式，通过对合理数据管理，提供程序中对于数据的操作效率，算法解决问题的一种处理方式，程序主要通过对数据的处理进行运行，数据结构决定了程序的处理是否能更加高效，也决定选用哪种算法模式来完成。

- **线性结构**

  物理线性，逻辑线性一致的，即在内存中数据的存储以线性存储；代表数组，两种常用模式栈和队列方式.

  数组结构可以诠释栈的方式和队列的方式.

  栈：后进先出，以栈低与栈顶，通过栈顶入栈，在栈顶出栈。常用的处理应用有在模板编译中对模板进行标签的父子节点的关系分析中；进制码的转换中，以余数进栈，最后出栈，完成进制转换。

  队列：先进先出，以队尾入队，队头出队。常用的处理应用有在组合函数中，以及中间件的执行上都运用了此方式管理函数的执行

  ```js
    // 十进制转为二进制
    function convert(num) {
      const res = [];
      while(num > 0) {
        let ret = num%2;
        num = Math.floor(num/2);
        res.push(ret);
      }
      return res.reverse().join('');
    }
    convert(10);
  ```
  ```js
   // 中间件运用
   const app = {
     fns: [],
     use(fnList) {
       if (!Array.isArray(fnList)) {
         fnList = [fnList];
       }
       fnList.forEach((item) => {
         this.fns.push(item);
       })
       return this;
     },
     run(callback) {
       let i = 0;
       let l = this.fns.length;
       this.fns.forEach(function(fn) {
         fn();
         i++;
       })
       return (i>=l && callback && callback(), i=0, this);
     }
   };
   app.use(function() {
     console.log('use1');
   }, function() {
     console.log('use2');
   }).run(function() {
     console.log('fns of use are exec done!');
   })
  ```

- **链表**

  单链表(除了头尾，其他节点有一个直接前驱和一个直接后继)，双链表(除头尾，每一个节点有两个指针，一个指向后继，一个指向前驱)，循环链表(尾节点指向头，其他节点一个直接前驱一个直接后继)；链表以物理不连续，逻辑连续，链表组成以元素和指针，指针完成对下一个节点的引用指向；

  ```js
    function linkList() {
      function Node(el) {
        this.el = el;
        this.next = null;
      }
      function Link() {
        this.head = null;
        this.l = 0;
      }
      Link.prototype.append = function(el, position) {
        const node = new Node(el);
        if (!this.head) {
          this.head = node;
        } else {
          const nodes = this.get(position);
          let current = nodes.current;
          let preNode = nodes.preNode;
          if (current !== null) {
            node.next = nodes.current;
          }
          if (preNode === current) {
            this.head = node;
          } else {
            nodes.preNode.next = node;
          }
        }
        this.l++;
      }
      Link.prototype.get = function(con) {
        if(!con || (con && (!con instanceof Link || typeof con !== 'number')) || this.head === null) {
          return;
        }
        con = Number.isNaN(Number(con)) ? con : Number(con);
        if (typeof con === 'number') {
          if (con >= this.l || con < 0) {
            return;
          }
        }
        let current = this.head;
        let preNode = current;
        let i = 0;
        while(current) {
          if (typeof con === 'number') {
            if (con === i) {
              break;
            }
          } else {
            if (con === current.el) {
              break;
            }
          }
          preNode = current;
          current = current.next;
          i++;
        }
        return {
          preNode,
          current
        };
      }
      Link.prototype.remove = function(el) {
        const nodes = this.get(el);
        nodes.preNode.next = nodes.current.next;
        this.l--;
      }
      Link.prototype.size = function() {
        return this.l;
      }
      return Link;
    }
    let link = new linkList();
    link.append(4);
  ```

    循环链表

  ```js
    function circleLink(arr) {
      let head = {pending: null, end:null};
      let node;
      // let current;
      const createNode = (item)=>{
        return {
          el: item,
          next: null
        }
      }
      arr.forEach((item) => {
        let { pending } = head;
        node = createNode(item);
        if (pending === null) {
          head.pending = node;
          head.end = node;
          node.next = node;
        } else {
          node.next = head.pending;
          head.end.next = node;
          head.pending = node;
        }
      })
      // console.log(head);
      return head;
    }
  circleLink([4,1,9]);
  ```

- **集合**

  集合为一个无序唯一的值集合，集合以[值，值]方式来存储

  ```js
    function Set() {
      this.sets = {};
    }
    Set.prototype.add = function(val) {
      if (this.has(val)) {
        return;
      }
      this.sets[val] = val;
      return val;
    }
    Set.prototype.has = function(key) {
      return Object.prototype.hasOwnProperty.call(this.sets, key);
    }
    Set.prototype.remove = function(val) {
      if (!this.has(val)) {
        return false;
      }
      delete this.sets[val];
      return true;
    }
    Set.prototype.clear = function() {
      this.sets = {};
      return true;
    }
    Set.prototype.size = function() {
      return Object.keys(this.sets).length;
    }
    Set.prototype.values = function() {
      return Object.keys(this.sets);
    }

    // 并集，交集，差集
    Set.prototype.union = function(otherSet) {
      const oSet = new Set();
      for(let a1 in this.values()){
        oSet.add(a1);
      }
      for(let a2 in otherSet.values()) {
        oSet.add(a2);
      }
      return oSet;
    }
    Set.prototype.intersection = function(otherSet) {
      const oSet = new Set();
      for(let a1 in this.values()) {
        if (otherSet.has(a1)) {
          oSet.add(a1);
        }
      }
      return oSet;
    }
    Set.prototype.subtraction = function(otherSet) {
      const oSet = new Set();
      for(let a1 in this.values()) {
        if (!otherSet.has(a1)) {
          oSet.add(a1);
        }
      }
      return oSet;
    }
  ```

- **字典散列**

  字典为[key,value]存储方式，理解为映射，其中散列为集合中的一种特殊表示，散列中即对key通过散列函数来建立散列值，以散列值与value建立散列表,通过散列函数来快速找到对应值，散列函数的建立决定了散列表中碰撞概率；在碰撞产生发送，通过分离链表与线性探查方式解决。

  分离链表：通过散列值建立的映射存储值格式以链表方式存储，将碰撞的值对应存储以链表格式存储

  线性探查：通过在散列值建立映射存储时，如果发现散列值产生碰撞，通过将散列值进行线性值增加，直到散列值不发送碰撞，将映射值存储

  ```js
    // 集合
    function Map() {
      this.maps = {};
    }
    Map.prototype.set = function(key, value) {
      if (!this.has(key)) {
        this.maps[key] = value;
      }
    }
    Map.prototype.get = function(key) {
      return this.maps[key];
    }
    Map.prototype.has = function(key) {
      return Object.prototype.hasOwnProperty.call(this.maps, key);
    }
    Map.prototype.size = function() {
      return Object.keys(this.maps);
    }
    Map.prototype.remove = function(key) {
      if (!this.has(key)) return false;
      delete this.maps[key];
      return true;
    }
    Map.prototype.clear = function() {
      this.maps = {};
      return true;
    }

    // 线性探查
    function HashTable() {
      this.tables = [];
    }
    // 散列函数，完成散列值生成
    function hashKey(key) {
      let n = 0;
      for(let i = 0; i < key.length; i++){
        n += key.charCodeAt(i);
      }
      return Number(n);
    }
    HashTable.prototype.set = function(key, value) {
      let k = hashKey(key);
      while(this.has(k)) {
        k++;
      }
      this.tables[k] = value;
    }
    HashTable.prototype.has = function(k) {
      return Object.prototype.hasOwnProperty.call(this.tables, k);
    }
    HashTable.prototype.get = function(key) {
      return this.tables[hashKey(key)];
    }
    HashTable.prototype.size = function() {
      let c = 0;
      for(let a in this.tables) {
        if (this.has(a)) {
          c++;
        }
      }
      return c;
    }
    HashTable.prototype.values = function() {
      let result = [];
      for(let a in this.tables) {
        if (this.has(a)) {
          result.push(this.tables[a]);
        }
      }
      return result;
    }
    HashTable.prototype.clear = function() {
      return this.tables = [];
    }
  ```

- **树**

  ```js
    // 树的创建，遍历，翻转
    class Tree {
      constructor(nodes) {
          this.size = 0;
          this.nodes = nodes;
          this.init();
      }
      node(el) {
          return {
            node: el,
            parent: null,
            left: null,
            right: null
          }
      }
      init() {
          this.forEach(this.nodes, (el, i) => {
            this.add(el);
          })
      }
      add(el) {
          if(!el) return;
          const node = this.node(el);
          if(!this.root) {
            this.root = this.currentNode = node;
          } else {
            while(this.currentNode) {
                let v = this.compare(node.node, this.currentNode.node);
                if (v <= 0) {
                  if (this.currentNode.left) {
                      this.currentNode = this.currentNode.left;
                      continue;
                  }
                  this.currentNode.left = node;
                  break;
                } else if (v > 0) {
                  if (this.currentNode.right) {
                      this.currentNode = this.currentNode.right;
                      continue;
                  }
                  this.currentNode.right = node;
                  break;
                }
            }
            if (this.currentNode.left || this.currentNode.right) {
              node.parent = this.currentNode;
            }
            this.currentNode = this.root;
          }
          this.size++;
      }
      compare(a, b) {
          return a - b;
      }
      visit(node) {
          console.log('当前节点:', node.node);
      }
      preVisitNode(fn) {
          const traverse = (node) => {
            if (node) {
                fn && fn(node);
                this.visit(node);
                traverse(node.left);
                traverse(node.right);
            }
          }
          console.log('先序访问：');
          traverse(this.currentNode);
      }
      midVisitNode(fn) {
          const traverse = (node) => {
            if (node) {
                fn && fn(node);
                traverse(node.left);
                this.visit(node);
                traverse(node.right);
            }
          }
          console.log('中序访问：');
          traverse(this.currentNode);
      }
      posVisitNode(fn) {
          const traverse = (node) => {
            if (node) {
                fn && fn(node);
                traverse(node.left);
                traverse(node.right);
                this.visit(node);
            }
          }
          console.log('后序访问：');
          traverse(this.currentNode);
      }
      layerVisitNode() {
          const stack = [];
          const next = function(node) {
            stack.push(node);
          }
          next(this.root);
          let currentNode;
          console.log('层级访问:');
          while(currentNode = stack.shift()) {
            this.visit(currentNode);
            currentNode.left && next(currentNode.left);
            currentNode.right && next(currentNode.right);
          }
      }
      reverseTreeNode() {
          this.preVisitNode(function(node) {
            let temp = node.left;
            node.left = node.right;
            node.right = temp;
          });
      }
      forEach(nodes, callback) {
          nodes.forEach((el, i) => {
            callback(el, i);
          })
      }
    }

    const utils = require('util')
    const nodes = [9, 3, 8, 5, 7, 10];
    const tree = new Tree(nodes);

    /*

    建立树：
        9
      3   10
        8
      5
        7

    翻转树：
        9
      10   3
          8
          5
          7
    */

    // 查看树
    console.log(utils.inspect(tree.root, true, 10));
    // 层级遍历
    tree.layerVisitNode();
  ```

  ```js
    // 链表递归翻转
    function traverse(head) {
      if (head && head.next === null) return head;
      let newHead = traverse(head.next);
      head.next.next = head;
      head.next = null;
      return newHead;
    }
    // 循环翻转
    function travserse1(head) {
      let temp;
      let newHead = null;
      while(head !== null) {
        temp = head.next;
        if (!newHead) {
          newHead = head;
          head.next = null;
        } else {
          head.next = newHead;
          newHead = head;
        }
        head = temp;
      }
      return newHead;
    };
  ```

- **图**
  非线性结构，主要解决网状结构场景，多线路的选择，距离等。建立节点之间的关系

- **排序**

  1. 冒泡排序

  思路理解：自然环境下最小最轻的会自然的冒到最上面，最大最重的会沉入底部; 通过比较相邻的大小;
  从小到大排序，大数冒泡，从大到小小数冒泡；外层循环控制总共循环次数，内存循环控制相邻数需要比较次数；每一次循环后都确定一个数的顺序，所以下次排序比较次数会小于一次，也就是外层循环一次就完成一次一个数字的顺序确定，内层循环依赖外层

  原排序，稳定排序，属于比较排序-交换排序
  最差o(n^2) 最好o(n),操作o(1)

  ```js
    // 从小到大 前一个大于后一个交互
    const arr = [5,1,0,8,2,3];
    let l = arr.length;
    let temp;
    for(let i=0; i<l-1; i++) {
      for(let j=0; j<l-i-1; j++) {
        // 这个位置大于号还是小于号决定了冒泡的排序
        if (arr[j] > arr[j+1]) {
          temp = arr[j+1];
          arr[j+1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  ```

  2. 选择排序

  思路理解：在一组数据中选择出最小的值，将值放在首位，通过默认将第一位为最小数索引记录，这样循环进行数据总个数减一次；而每一次循环内部与每一个数进行比对，选出最小数的下标进行替换记录

  原排序，非稳定排序，属于比较排序-选择排序
  最差o(n^2) 最好o(n^2),操作o(1)

  ```js
    // 3251
    let arr = [3,2,5,1];
    let l = arr.length;
    let min = 0;
    // 外层决定进行几次循环
    for(let i = 0; i<l-1; i++) {
      // 内层完成可以比对到最后一个值
      for(let j=i+1; j<l; j++) {
        if (arr[min] > arr[j]) {
          min = j;
        }
      }
      if (min !== i) {
        let temp = arr[i];
        arr[i] = arr[min];
        arr[min] = temp;
      }
    }
  ```

  3. 插入排序

  思路理解： 默认第一项为已拍好序，从第二项开始与前面拍好序的数据进行比对找到正确位置，最后将其插入到正确位置；插入排序主要是在找插入数据的位置

  原排序，稳定排序，属于比较排序-插入排序
  最差o(n^2) 最好o(n),操作o(1)

  ```js
    let arr = [3,4,2,1];
    let l = arr.length;
    let i = 1; // 记录需要排序的数据位置
    while(i < l) {
      let sortNum = arr[i];
      let j = i;
      while(j>0 && sortNum < arr[j-1]) {
        arr[j] = arr[j-1];
        j--;
      }
      if (j > 0) {
        arr[j] = sortNum;
      }
      i++;
    }
  ```

  4. 快速排序

  思路理解：通过计算中间主元，并创建头指针和尾指针，分别指向头尾，进行头尾与主元比较，当头比主元小则向后移动指针，当尾比主元大则尾指针向前移动
  ```js

  ```

  5. 归并排序

  思路理解：主要是采用了分二治，先分后合，将数据分割为最小单位，然后进行比对最小单位进行组合排序返回，最终将合并完整，并排好序

  非原排序，稳定排序，属于比较排序-归并排序
  o(log2n)

  ```js
    let arr = [3,2,5,1];
    function merge(left, right) {
      // 设置比对索引
      let il = 0;
      let ir = 0;
      // 收集最后合并值
      let result = [];
      while(il < left.length && ir < right.length) {
        if (left[il] < right[ir]) {
          // 插入后将索引加一，比对后面的
          result.push(left[il++]);
        }
        if (left[il] > right[ir]) {
          result.push(right[ir++]);
        }
      }
      // 将前面比对后多余出来的结果进行插入到result收集
      while (il < left.length) {
        result.push(left[il++]);
      }
      while (ir < right.length) {
        result.push(right[ir++]);
      }
      return result;
    }
    function guiBin(arr) {
      // 当递归为最小单位后直接返回
      if (arr.length === 1) return arr;
      // 每一次分割以中间数进行切割
      let l = arr.length;
      let middle = Math.floor(l/2);
      let left = arr.slice(0, middle);
      let right = arr.slice(middle, l);
      // 当每一个分割为最小后，进行比对合并
      return merge(guiBin(left), guiBin(right));
    }
    guiBin(arr);
  ```

  6. 计数排序

  在排序数量有限值情况下利用数组索引统计每一个排序值出现的数量，进行按排序数字作为索引进行统计数量，后期利用整合数组每一个索引出现的数量进行重组完成。由于利用了索引，局限于数组协助完成. 新建立数组长度决定于输入数组中最大值

  非原排序，稳定排序,属于非比较排序
  时间复杂：o(n+k)
  空间复杂：o(k)

  ```js
    function countingSort(arr) {
      let bucket = [];
      let l = arr.length;
      let index = 0;
      // arr.length
      for(let i=0;i<l;i++) {
        let curr = arr[i];
        if (!(curr in bucket)) {
          bucket[curr] = 1;
        } else {
          bucket[curr] = ++bucket[curr];
        }
      }
      // 若arr数组中元素在0-k之间则创建bucket的长度为k+1
      for(let j=0;j<bucket.length;j++) {
        while(j in bucket && bucket[j] > 0) {
          arr[index++] = j;
          bucket[j]--;
        }
      }
      // 时间复杂o(n+k) 空间复杂o(k)创建bucket空间
      return arr;
    }
    countingSort([3,1,2,5,3,8]);
  ```

- **查找**

  1. 顺序查找
  思路理解：以循环列表项，进行比对查找项，返回查找到项的位置

  2. 二分法查找
  思路理解：这种排序方式是要求本身是具有顺序的，这样通过每次找中间点来确定新值需要插入到的方向，反复多次后，即可确定值的位置

  ```js

    function indexOf(arr, item) {
      let l = arr.length;
      let start = 0;
      let end = l-1;

      let index;
      let m;
      let flag = false;
      while(start <= end) {
        index = Math.floor((end+start)/2);
        m = arr[index];
        if (m > item) {
          end = index-1;
        } else if(m < item) {
          start = index+1;
        } else{
          flag = true;
          break;
        }
      }
      if (flag === false) {
        return -1
      }
      return index;
    }

    console.log(indexOf([1,2,3,4,5,6,8,10], -1));
  ```
## 介绍
  通过发布订阅思想模式，完成对webpack的一连串的流程控制库，通过提供挂载方法，流程性的完成触发，可以说是webpack的生命周期钩子函数; 内部除了运用了发布订阅思想，其次运用了动态生成函数编译的方式，以及工厂函数抽象化思想

## 源码深入

 钩子函数分为同步异步(sync, async)，串行(series)，并行(parallel)

 异步处理方式：回调函数，发布订阅(观察者模式基于发布订阅)，事件发布订阅，promise（内部实现回调+发布订阅）

 串行：一个任务完成接一个任务执行

 并行：同时多任务执行，之间不会产生互相的关联

 SyncHook，SyncBailHook，SyncLoopHook，SyncWaterfallHook均以同步串行的方式完成

 AsyncParallelHook，AsyncParallelBailHook，AsyncSeriesHook，AsyncSeriesBailHook，AsyncSeriesWaterfallHook均以异步并行方式完成

 同步订阅 tap, 同步发布call

 异步订阅 tapAsync tapPromise , 异步发布 callAsync promise

 在源码实现上订阅方式逻辑相同的，也就是说（tap，tapAsync，tapPromise），发布模式上体现在(sync与async)两种主流程方式

 - SyncHook

  无需返回结果，执行所有任务

  ```js
    let hook = new SyncHook(['name']);
    hook.tap('syncHook1', (name) => {
      console.log('syncHook1:', name);
    });
    hook.tap('syncHook2', (name) => {
      console.log('syncHook1:', name);
    });
    hook.call('kk');
  ```

  SyncHook 简单定义实现:

  ```js
    class reSyncHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tap(name, fn) {
        fn && this.tasks.push(fn)
      }
      call(...arg) {
        this.tasks.forEach((task) => {
          task(...arg);
        })
      }
    }
    let hook = new reSyncHook(['name']);
    hook.tap('syncHook1', (name) => {
      console.log('syncHook1:', name);
    });
    hook.tap('syncHook2', (name) => {
      console.log('syncHook1:', name);
    });
    hook.call('kk');
  ```

 - SyncBailHook

  每一个任务返回值为非undefined将结束循环，即下一个任务的开始取决于上一个任务返回值情况

  ```js
    let hook = new SyncBailHook(['name']);
    hook.tap('SyncBailHook1', (name) => {
      console.log('SyncBailHook1:', name);
      // return 'SyncBailHook1';
      /* print:
        SyncBailHook1: kk
      */
    });
    hook.tap('SyncBailHook2', (name) => {
      console.log('SyncBailHook2:', name);
      // return 'SyncBailHook2';
      /* print:
        SyncBailHook1: kk
        SyncBailHook2: kk
      */
    });
    hook.tap('SyncBailHook3', (name) => {
      console.log('SyncBailHook3:', name);
      // 默认也会打印没有return
      // return 'SyncBailHook3';
      /* print:
        SyncBailHook1: kk
        SyncBailHook2: kk
        SyncBailHook3: kk
      */
    });
    hook.call('kk');
  ```

  SyncBailHook 简单定义实现:

  ```js
    class reSyncBailHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tap(name, fn) {
        fn && this.tasks.push(fn)
      }
      call(...arg) {
        let i = 0;
        const rest = () => {
          i = 0;
          this.tasks = [];
        }
        const next = () => {
          if (i >= this.tasks.length) {
            rest();
            return;
          }
          let task = this.tasks[i++];
          let result = task(...arg);
          if (result !== undefined) {
            rest();
            return;
          } else {
            next();
          }
        }
        next();
      }
    }
    let hook = new reSyncBailHook(['name']);
    hook.tap('SyncBailHook1', (name) => {
      console.log('SyncBailHook1:', name);
      // return 'SyncBailHook1';
      /* print:
        SyncBailHook1: kk
      */
    });
    hook.tap('SyncBailHook2', (name) => {
      console.log('SyncBailHook2:', name);
      // return 'SyncBailHook2';
      /* print:
        SyncBailHook1: kk
        SyncBailHook2: kk
      */
    });
    hook.tap('SyncBailHook3', (name) => {
      console.log('SyncBailHook3:', name);
      // 默认也会打印没有return
      // return 'SyncBailHook3';
      /* print:
        SyncBailHook1: kk
        SyncBailHook2: kk
        SyncBailHook3: kk
      */
    });
    hook.call('kk');
  ```

 - SyncLoopHook

  当前执行任务的返回值为undefined将进行下一个任务，不等于undefined循环将每次从第一个任务开始执行

  ```js
    let hook = new SyncLoopHook(['name']);
    let index1 = 0;
    let index2 = 0;

    hook.tap('SyncLoopHook1', (name) => {
      console.log('SyncLoopHook1:', name, index1);
      return (++index1 === 1 ? (index1 = 0, undefined) : '继续执行');
    });
    hook.tap('SyncLoopHook2', (name) => {
      console.log('SyncLoopHook2:', name, index2);
      return (++index2 === 2 ? (index2 = 0, undefined) : '继续执行');
    });
    hook.call('kk');
    // print:
    // SyncLoopHook1: kk 0
    // SyncLoopHook2: kk 0
    // SyncLoopHook1: kk 0
    // SyncLoopHook2: kk 1
  ```

  SyncLoopHook 简单定义实现:

  ```js
    class reSyncLoopHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tap(name, fn) {
        fn && this.tasks.push(fn)
      }
      call(...arg) {
        let loop = false;
        let i = 0;
        const next = () => {
          do {
            if (i >= this.tasks.length) {
              this.tasks = [];
              i = 0;
              return;
            }
            loop = false;
            let result = (this.tasks[i])(...arg);
            if (result !== undefined) {
              if (i !== 0) {
                i = 0;
                next();
                return;
              }
              loop = true;
            } else {
              ++i;
              next()
            }
          }while(loop && i < this.tasks.length)
        }
        next();
      }
    }
    let hook = new reSyncLoopHook(['name']);
    let index1 = 0;
    let index2 = 0;
    hook.tap('SyncLoopHook1', (name) => {
      console.log('SyncLoopHook1:', name, index1);
      return (++index1 === 1 ? (index1 = 0, undefined) : '继续执行');
    });
    hook.tap('SyncLoopHook2', (name) => {
      console.log('SyncLoopHook2:', name, index2);
      return (++index2 === 2 ? (index2 = 0, undefined) : '继续执行');
    });
    hook.call('kk');
  ```

 - SyncWaterfallHook

  同步执行每执行一个任务，任务返回值为非undefined将作为下一个任务的data参数传入

  ```js
    let hook = new SyncWaterfallHook(['name']);
    hook.tap('SyncWaterfallHook1', (name) => {
      console.log('SyncWaterfallHook1:', name);
      return 'SyncWaterfallHook1';
    });
    hook.tap('SyncWaterfallHook2', (data) => {
      console.log('SyncWaterfallHook2:', data);
      return 'SyncWaterfallHook2';
    });
    hook.tap('SyncWaterfallHook3', (data) => {
      console.log('SyncWaterfallHook3:', data);
    });
    hook.call('kk');
    /*
      SyncWaterfallHook1: kk
      SyncWaterfallHook2: SyncWaterfallHook1
      SyncWaterfallHook3: SyncWaterfallHook2
    */
  ```

  SyncWaterfallHook 简单定义实现:

  ```js
    class reSyncWaterfallHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tap(name, fn) {
        fn && this.tasks.push(fn)
      }
      call(...arg) {
        this.tasks.forEach((task) => {
          let result = task(...arg);
          if (result !== undefined) {
            arg[0] = result;
          }
        })
      }
    }
    let hook = new reSyncWaterfallHook(['name']);
    hook.tap('SyncWaterfallHook1', (name) => {
      console.log('SyncWaterfallHook1:', name);
      return 'SyncWaterfallHook1';
    });
    hook.tap('SyncWaterfallHook2', (data) => {
      console.log('SyncWaterfallHook2:', data);
      return 'SyncWaterfallHook2';
    });
    hook.tap('SyncWaterfallHook3', (data) => {
      console.log('SyncWaterfallHook3:', data);
    });
    hook.call('kk');
  ```

 - AsyncParallelHook

   异步并行执行，任务同时执行，并发时间为运行任务最大时长，不关注回调参数中data,即cb(null, data);触发最终回调不停止后续任务

   tapAsync模式下当cb执行后触发最后回调函数，注意的是cb回调提供错误信息，将触发提前触发最后回调函数,即cb('error')/cb();

   promise reject将触发捕获

   ```js
    let hook = new AsyncParallelHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncParallelHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelHook1:', name);
        cb('error');
      }, 1000)
    });
    hook.tapAsync('AsyncParallelHook2', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelHook2:', name);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncParallelHook3', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelHook3:', name);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e) => {
      console.log('finished:', e);
      console.timeEnd('end');
    });
    /*
      AsyncParallelHook1: kk
      finished: error
      end: 1007.697ms
      AsyncParallelHook2: kk
      AsyncParallelHook3: kk
    */

    // promise版
    console.time('end');
    hook.tapPromise('AsyncParallelHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelHook1:', name);
          // reject('error');
          resolve();
        }, 1000)
      })
    })
    hook.tapPromise('AsyncParallelHook2', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelHook2:', name);
          resolve();
        }, 2000)
      })
    })
    hook.tapPromise('AsyncParallelHook3', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelHook3:', name);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then(() => {
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

   AsyncParallelHook 简单定义实现:

   ```js
    class reAsyncParallelHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tapAsync(name, fn) {
        fn && this.tasks.push(fn)
      }
      tapPromise(name, fn) {
        fn && this.tasks.push(fn)
      }
      callAsync(...arg) {
        let i = 0;
        const finalCallback = arg.pop();
        const cb = (e) => {
          if (e || (i >= this.tasks.length-1)) {
            i = 0;
            finalCallback(e);
            return;
          }
          ++i;
        }
        this.tasks.forEach((task) => {
          task(...arg, cb)
        })
      }
      promise(...arg) {
        let result = this.tasks.map((task) => {
          return task(...arg);
        })
        return Promise.all(result);
      }
    }
    let hook = new reAsyncParallelHook(['name']);

    console.time('end');
    hook.tapAsync('AsyncParallelHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelHook1:', name);
        cb('error');
      }, 1000)
    });
    hook.tapAsync('AsyncParallelHook2', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelHook2:', name);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncParallelHook3', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelHook3:', name);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e) => {
      console.log('finished:', e);
      console.timeEnd('end');
    });

    // promise版
    console.time('end');
    hook.tapPromise('AsyncParallelHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelHook1:', name);
          // reject('error');
          resolve();
        }, 1000)
      })
    })
    hook.tapPromise('AsyncParallelHook2', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelHook2:', name);
          resolve();
        }, 2000)
      })
    })
    hook.tapPromise('AsyncParallelHook3', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelHook3:', name);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then(() => {
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

 - AsyncParallelBailHook

   异步并行保险钩子，任务同时执行，并发时长为运行成功任务最大任务时长，且有回调函数data返回值

   tapAsync模式下cb('error')/cb()/cb(null, data) 发起最后回调函数触发，但不会停止后续任务运行

   ```js
    let hook = new AsyncParallelBailHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncParallelBailHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelBailHook1:', name);
        cb();
      }, 1000)
    });
    hook.tapAsync('AsyncParallelBailHook2', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelBailHook2:', name);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncParallelBailHook3', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelBailHook3:', name);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e, v) => {
      // e->error v->data
      console.log('finished:', e, v);
      console.timeEnd('end');
    });

    // promise 版
    console.time('end');
    hook.tapPromise('AsyncParallelBailHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelBailHook1:', name);
          // reject('error');
          resolve('AsyncParallelBailHook1');
        }, 1000)
      })
    })
    hook.tapPromise('AsyncParallelBailHook2', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelBailHook2:', name);
          resolve();
        }, 2000)
      })
    })
    hook.tapPromise('AsyncParallelBailHook3', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelBailHook3:', name);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then((r) => {
      console.log('data:', r);
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

   AsyncParallelBailHook 简单定义实现:

   ```js
    class reAsyncParallelBailHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tapAsync(name, fn) {
        fn && this.tasks.push(fn)
      }
      tapPromise(name, fn) {
        fn && this.tasks.push(fn)
      }
      callAsync(...arg) {
        let i = 0;
        const _this = this;
        const finalCallback = arg.pop();
        const cb = function () {
          let error;
          let data;
          if (arguments.length > 0) {
            error = (arguments[0] == undefined || arguments[0] == '') ? null : arguments[0];
            data = arguments[1] ? arguments[1] : undefined;
          }
          if (error || data || (i >= _this.tasks.length-1)) {
            i = 0;
            let params = [];
            error ? (params = [...params, error]) : (data ? (params = [null, data]) : undefined);
            params.length ? finalCallback(...params) : finalCallback()
            return;
          }
          ++i;
        }
        this.tasks.forEach((task) => {
          task(...arg, cb);
        })
      }
      promise(...arg) {
        let result = this.tasks.map((task) => {
          return task(...arg);
        })
        return Promise.all(result).then((resolvePromise)=>{
          return resolvePromise.find((item)=>{
            return item;
          })
        });
      }
    }
    let hook = new reAsyncParallelBailHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncParallelBailHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelBailHook1:', name);
        cb();
      }, 1000)
    });
    hook.tapAsync('AsyncParallelBailHook2', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelBailHook2:', name);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncParallelBailHook3', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncParallelBailHook3:', name);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e, v) => {
      console.log('finished:', e, v);
      console.timeEnd('end');
    });

    // promise 版
    hook.tapPromise('AsyncParallelBailHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelBailHook1:', name);
          // reject('error');
          resolve('AsyncParallelBailHook1');
        }, 1000)
      })
    })
    hook.tapPromise('AsyncParallelBailHook2', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelBailHook2:', name);
          resolve();
        }, 2000)
      })
    })
    hook.tapPromise('AsyncParallelBailHook3', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncParallelBailHook3:', name);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then((r) => {
      console.log('data:', r);
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

 - AsyncSeriesHook

   异步串行钩子函数，任务执行时间为所有任务总和, 不关注cb(null, data)

   tapAsync 执行cb回调(cb()全部执行/cb('error')结束后续任务，跳入最终回调执行)

   promise reject('error')

   ```js
    let hook = new AsyncSeriesHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncSeriesHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesHook1:', name);
        cb();
      }, 1000)
    });
    hook.tapAsync('AsyncSeriesHook2', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesHook2:', name);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncSeriesHook3', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesHook3:', name);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e) => {
      console.log('finished:', e);
      console.timeEnd('end');
    });

    // promise 版
    console.time('end');
    hook.tapPromise('AsyncSeriesHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesHook1:', name);
          reject('error');
          // resolve('AsyncSeriesHook1');
        }, 1000)
      })
    })
    hook.tapPromise('AsyncSeriesHook2', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesHook2:', name);
          resolve();
        }, 2000)
      })
    })
    hook.tapPromise('AsyncSeriesHook3', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesHook3:', name);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then(() => {
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

   AsyncSeriesHook简单实现：

   ```js
    class reAsyncSeriesHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tapAsync(name, fn) {
        fn && this.tasks.push(fn)
      }
      tapPromise(name, fn) {
        fn && this.tasks.push(fn)
      }
      callAsync(...arg) {
        let i = 0;
        const _this = this;
        const finalCallback = arg.pop();
        const collectParam = function () {
          if (arguments.length > 0) {
            return arguments[0];
          }
        }
        const next = function () {
          const error = collectParam(...arguments);
          if (error || i >= _this.tasks.length) {
            i = 0;
            _this.tasks = [];
            error ? finalCallback(error) : finalCallback();
            return;
          }
          _this.tasks[i++](...arg, next);
        }
        next();
      }
      promise(...arg) {
        const [first, ...others] = this.tasks;
        return others.reduce((p, n) => {
          return p.then(() => {
            return n(...arg);
          });
        }, first(...arg))
      }
    }

    let hook = new reAsyncSeriesHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncSeriesHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesHook1:', name);
        cb();
      }, 1000)
    });
    hook.tapAsync('AsyncSeriesHook2', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesHook2:', name);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncSeriesHook3', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesHook3:', name);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e) => {
      console.log('finished:', e);
      console.timeEnd('end');
    });

    // promise 版
    console.time('end');
    hook.tapPromise('AsyncSeriesHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesHook1:', name);
          reject('error');
          // resolve('AsyncSeriesHook1');
        }, 1000)
      })
    })
    hook.tapPromise('AsyncSeriesHook2', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesHook2:', name);
          resolve();
        }, 2000)
      })
    })
    hook.tapPromise('AsyncSeriesHook3', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesHook3:', name);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then(() => {
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

 - AsyncSeriesBailHook

   异步串行保险钩子，运行时间为运行任务总和，关注cb(null, data),每一个任务在执行完成回调操作将影响下一个任务,若有错将跳入最终回调函数，若无错，将结束下面任务，返回最终回调

   tapAsync 执行cb回调(cb()全部任务都会执行/cb('error')跳转到最终回调/cb(null, data)结束后续任务执行，跳入最终回调)

   promise reject('error')/resolve('data');

   ```js
    let hook = new AsyncSeriesBailHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncSeriesBailHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesBailHook1:', name);
        cb();
      }, 1000)
    });
    hook.tapAsync('AsyncSeriesBailHook2', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesBailHook2:', name);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncSeriesBailHook3', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesBailHook3:', name);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e, v) => {
      console.log('finished:', e, v);
      console.timeEnd('end');
    });

    // promise 版
    console.time('end');
    hook.tapPromise('AsyncSeriesBailHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesBailHook1:', name);
          // reject('error');
          resolve('AsyncSeriesBailHook1');
        }, 1000)
      })
    })
    hook.tapPromise('AsyncSeriesBailHook2', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesBailHook2:', name);
          resolve();
        }, 2000)
      })
    })
    hook.tapPromise('AsyncSeriesBailHook3', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesBailHook3:', name);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then((r) => {
      console.log('data:', r);
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

   AsyncSeriesBailHook简单实现：

   ```js
    class reAsyncSeriesBailHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tapAsync(name, fn) {
        fn && this.tasks.push(fn)
      }
      tapPromise(name, fn) {
        fn && this.tasks.push(fn)
      }
      callAsync(...arg) {
        let i = 0;
        const _this = this;
        const finalCallback = arg.pop();
        const collectParam = function () {
          const result = {};
          if (arguments.length > 0) {
            arguments[0] && (result.error = arguments[0]);
            arguments[1] && (result.data = arguments[1]);
          }
          return result;
        }
        const next = function () {
          const result = collectParam(...arguments);
          if (result.error || result.data || i >= _this.tasks.length) {
            i = 0;
            _this.tasks = [];
            result.error ? finalCallback(result.error) : (result.data ? finalCallback(null, result.data) : finalCallback())
            return;
          }
          _this.tasks[i++](...arg, next);
        }
        next();
      }
      promise(...arg) {
        const [first, ...others] = this.tasks;
        return others.reduce((p, n) => {
          return p.then((r) => {
            if (r) {
              return r;
            }
            return n(...arg);
          });
        }, first(...arg))
      }
    }
    let hook = new reAsyncSeriesBailHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncSeriesBailHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesBailHook1:', name);
        cb();
      }, 1000)
    });
    hook.tapAsync('AsyncSeriesBailHook2', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesBailHook2:', name);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncSeriesBailHook3', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesBailHook3:', name);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e, v) => {
      console.log('finished:', e, v);
      console.timeEnd('end');
    });

    // promise 版
    console.time('end');
    hook.tapPromise('AsyncSeriesBailHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesBailHook1:', name);
          // reject('error');
          resolve('AsyncSeriesBailHook1');
        }, 1000)
      })
    })
    hook.tapPromise('AsyncSeriesBailHook2', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesBailHook2:', name);
          resolve();
        }, 2000)
      })
    })
    hook.tapPromise('AsyncSeriesBailHook3', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesBailHook3:', name);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then((r) => {
      console.log('data:', r);
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

 - AsyncSeriesWaterfallHook

   异步串行瀑布钩子，像瀑布流一样一个流向另一个,一个任务完成后执行下一个，完成任务回调参数，将作为下一个任务的输入参数，每一步都保留了上一步可保留的值

   tapAsync 任务的cb(null, data),将作为下一个函数的参数data,cb(null, data)最后返回到最终的回调函数结束，cb(err),则结束后续任务跳入最终回调函数

   promise resolve('data') / reject('error')

   ```js
    let hook = new AsyncSeriesWaterfallHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncSeriesWaterfallHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesWaterfallHook1:', name);
        cb();
      }, 1000)
    });
    hook.tapAsync('AsyncSeriesWaterfallHook2', (data, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesWaterfallHook2:', data);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncSeriesWaterfallHook3', (data, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesWaterfallHook3:', data);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e, v) => {
      console.log('finished:', e, v);
      console.timeEnd('end');
    });

    // promise版
    console.time('end');
    hook.tapPromise('AsyncSeriesWaterfallHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesWaterfallHook1:', name);
          // reject('error');
          resolve('AsyncSeriesWaterfallHook1');
        }, 1000)
      })
    })
    hook.tapPromise('AsyncSeriesWaterfallHook2', (data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesWaterfallHook2:', data);
          // reject('22');
          resolve('AsyncSeriesWaterfallHook2');
        }, 2000)
      })
    })
    hook.tapPromise('AsyncSeriesWaterfallHook3', (data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesWaterfallHook3:', data);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then((r) => {
      console.log('data:', r);
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```

   AsyncSeriesWaterfallHook简写版：
   ```js
    class reAsyncSeriesWaterfallHook {
      constructor(options){
        if (typeof options === 'string') {
          options = [options]
        }
        this._arg = options;
        this.tasks = []
      }
      tapAsync(name, fn) {
        fn && this.tasks.push(fn)
      }
      tapPromise(name, fn) {
        fn && this.tasks.push(fn)
      }
      callAsync(...arg) {
        let i = 0;
        const result = {};
        const _this = this;
        const finalCallback = arg.pop();
        const collectParam = function () {
          if (arguments.length > 0) {
            arguments[0] && (result.error = arguments[0]);
            arguments[1] && (arg[0] = result.data = arguments[1]);
          }
          return result;
        }
        const next = function () {
          const result = collectParam(...arguments);
          if (result.error || i >= _this.tasks.length) {
            i = 0;
            _this.tasks = [];
            result.error ? finalCallback(result.error) : (result.data ? finalCallback(null, result.data) : finalCallback())
            return;
          }
          _this.tasks[i++](...arg, next);
        }
        next();
      }
      promise(...arg) {
        const [first, ...others] = this.tasks;
        return others.reduce((p, n) => {
          return p.then((r) => {
            if (r) {
              arg[0] = r;
            }
            return n(...arg).then((r)=>{
              if (!r) {
                return arg[0];
              }
              return r;
            })
          });
        }, first(...arg))
      }
    }
    let hook = new reAsyncSeriesWaterfallHook(['name']);
    console.time('end');
    hook.tapAsync('AsyncSeriesWaterfallHook1', (name, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesWaterfallHook1:', name);
        cb();
      }, 1000)
    });
    hook.tapAsync('AsyncSeriesWaterfallHook2', (data, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesWaterfallHook2:', data);
        cb();
      }, 2000)
    });
    hook.tapAsync('AsyncSeriesWaterfallHook3', (data, cb) => {
      setTimeout(() => {
        console.log('AsyncSeriesWaterfallHook3:', data);
        cb();
      }, 3000)
    });
    hook.callAsync('kk', (e, v) => {
      console.log('finished:', e, v);
      console.timeEnd('end');
    });

    // promise版
    console.time('end');
    hook.tapPromise('AsyncSeriesWaterfallHook1', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesWaterfallHook1:', name);
          // reject('error');
          resolve('AsyncSeriesWaterfallHook1');
        }, 1000)
      })
    })
    hook.tapPromise('AsyncSeriesWaterfallHook2', (data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesWaterfallHook2:', data);
          // reject('22');
          resolve('AsyncSeriesWaterfallHook2');
        }, 2000)
      })
    })
    hook.tapPromise('AsyncSeriesWaterfallHook3', (data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('AsyncSeriesWaterfallHook3:', data);
          resolve();
        }, 3000)
      })
    })
    hook.promise('kk').then((r) => {
      console.log('data:', r);
      console.timeEnd('end');
    }).catch((e) => {
      console.log('error:', e);
      console.timeEnd('end');
    })
   ```


- 源码亮点

  1. 基本钩子类 Hook

     - 完成了(tap, tapAsync, tapPromise, call, callAsync, promise)

     - 完成实例参数options处理，以及订阅函数的存储(this.tasks=[])

     <!-- ```js
     ``` -->

  2. 钩子工厂函数类 HookCodeFactory

     - 完成对应钩子函数js模板代码编译，根据不同的type(sync,async)拿到符合的new Function构造构造执行函数，组合this._arg,this.header,this.content完成最后js模板

     - 其他附属提供完成js模板生成需要的验证和拼接处理函数

  3. 9种方法类

    同步：(SyncHook, SyncBailHook, SyncLoopHook, SyncWaterfallHook)

    异步：(AsyncParalleHook, AsyncParalleBailHook, AsyncSeriesHook, AsyncSeriesBailHook, AsyncSeriesWaterfallHook)

    - 每一个任务钩子都分别基于钩子工厂函数生成自己的工厂函数，并提供自己独立的content拼接模板的要求，不耦合其他

    - 每一个任务都继承于基本Hook类，来实现调用发布订阅方法，并衔接配合调用自己的钩子代码工厂函数完成模板的生成

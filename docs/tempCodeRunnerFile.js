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
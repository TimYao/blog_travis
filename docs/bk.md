### react

- 构建用户js库

- 类组件：继承自React.Component

- 函数组件: 函数定义

- prop/state: prop由父到子传递信息，state组件状态，记录组件内部状态变化，prop静态化，state动态化

- 组件通信：

  prop/state;context.provide/context.consumer

- 组件渲染过程：

  模板->ast->虚拟节点->真实dom

  编译过程：将模板转换成对应React.createElement(tag, props, children)（词法，语法分析完成）

  渲染过程：将虚拟节点转为真实节点。

  通过虚拟节点类型以文本，元素，组件(类组件，函数组件)，文本与元素创建对应DOM节点，组件则进行类组件实例化
  调用render执行,并将对应的props,ref等传入render中给组件内部的内容；函数组件则执行并传入props,ref等
  执行后得到对应的子内容虚拟节点，并调用createDom创建真实节点，组件虚拟节点上记录对应的子内容虚拟节点，虚拟节点
  上记录真实节点；createDom过程完成更新属性(样式，class, 事件等)，渲染虚拟节点children孩子。

  合成事件：在更新事件时候对元素进行绑定记录事件与事件监听器，并将事件绑定到document(16前)或者父节点，在建立
  事件代理过程中，对原始event进行复用创建单例保存，并监测target冒泡节点，从dom中获取到对应的事件和事件监听器
  执行监听器，并传入单例复用的event；

  合成事件作用：减少dom节点的绑定；更好的浏览器兼容平台化；进行功能扩展化增加批量更新。

- fiber引入

  优化点：由于组件节点量大，导致大量内存占用，渲染过程卡顿，性能消耗严重；引入分片渲染节点，通过将每一个节点创建为
  一个fiber节点，将fiber节点引入到浏览器刷新频率针中，将渲染节点过程大量任务进行多任务分时进行，由于浏览器渲染为
  每秒60针，一针16.6ms，一针分为输入事件(keydown),定时器，onresize/onscroll事件，requestAnimation, 布局
  渲染，绘制，requestIdeCallback,我们将多余任务放入到requestIdeCallback中进行下一次渲染准备，提升渲染性能

- 批量更新

  组件的更新建立在props,state变化引起；每一个组件对应一个更新器，更新器中存储多个state操作变更(对象/函数)，每
  一个更新器在事件开始前会被标识为非批量更新状态，这样就将记录到更新器队列中，在事件触发后将状态设置为更新，这样在
  状态未改变前操作的所有setState都会存储到对应更新器中，状态变化后批量执行；将执行后的结果更新到组件记录上，并
  再次调用组件render，比对新老虚拟节点，并更新真实DOM

- 生命周期

  类组件存在生命周期函数，函数组件无生命周期；

  类组件执行过程：class constructor -> init
               componentWillMount -> mount
               render -> mount
               componentDidMount -> mount

               props -> update
               componentWillReceivePros
          shouldComponentUpdate
                true
          componentWillUpdate
                render
           componentDidUpdate

               state -> update
          shouldComponentUpdate
                true
          componentWillUpdate
                render
           componentDidUpdate

           componentWillUnMount -> unMount

- ref, context.provide/context.consumer





<!-- er
     id eid url status
                 ok

     eid->

     eid+token->

     code->
     access_token
       uid+token

    对比 uid后token与eid token更新eid状态并跳转页面 -->






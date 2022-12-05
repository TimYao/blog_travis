## HTML

  - **块级元素，行内元素**

    块级元素:

      常用标签：div, h1-h6, ul, ol, p等

      特点：标签通栏展示，每一个标签都占满一行展示；可设置width,height,margin,padding有效果;可内嵌块级与行内元素

    行内元素：

      常用标签：span, b, strong, a等

      特点：标签相邻排列，空间不够发送折行；对设置width,margin-top,margin-bottom无效；左右间接设置生效；宽度受内容影响；不能内嵌块级元素

    之间可以通过设置display: inline-block 转为行内块级元素

  - **跨页面通信**

    - **BroadcastChannel**

      针对同域页面下的通信，类似于message

      a,b页面同域
      ```js
        // a页面
        const bc = new BroadcastChannel('hi')
        bc.onmessage = function(ev) {
          // yes
          console.log(ev.data);
        }
        bc.postMessage({from: 'hi'});
      ```
      ```js
        // b页面
        const bc = new BroadcastChannel('hi')
        bc.onmessage = function(ev) {
          // hi
          console.log(ev.data);
        }
        bc.postMessage({from: 'yes'});
      ```

    - **Service Worker**

      建立在客户端与服务器端的网络代理拦截器，通过建立worker线程在网络离线下缓存可访问到访问资源；

    - **LocalStorage**

      同域下界面通信，利用storeEvent监听事件，在其他页面分别加入window.addEventListener('storage', fn)监听，当LocalStorage.setItem传递值时，触发以上事件获取；这里需要注意的是事件触发在值变化的情况下

      ```js
        // 需要通信的页面
        window.addEventListener('store', function(e) {
          console.log(e.m);
        })
      ```
      ```js
        LocalStore.setItem('m', 'hello');
      ```

    - **Shared Worker**

    - **indexDB**

    - **window.open + window.opener**

      本质还是利用了window.postMessage与window.onmessage方式来传递；通过收集window.open打开的子窗口，并用打开窗口向子窗口发送消息，子窗口通过window.opener来对向父窗口传送消息

      ```js
        const child = [];
        document.getElementById('btn').onclick = function() {
          const sub = window.open('./page.html');
          child.push(sub);
        }
        child.filter((w) => !w.closed)
        child.forEach((c) => {
          c.postMessage({message: 'message'});
        })

        window.addEventListener('message', function(e) {
          console.log('收到消息', e.data);
        })
      ```
      ```js
        window.addEventListener('message', function(e){
          console.log('收到的消息', e.data);
          if (window.opener) {
            window.opener.postMessage({message: 'message'})
          }
        })
      ```

    - **Websocket**

    - **服务器推送方式**


  - **前端路由方式(history, hash)**

    早期模式下以服务路由方式导航访问资源，随着ajax模式的出现，很多场景希望通过异步方式去获取数据，提高体验，提高页面加载速度，随着现今开发模式的转变，前后端的独立开发模式，以单页面模式为突出，形成了单页+异步数据方式，对于切换页面展示通过前端的路由方式来决定

    hash: 早期已经具有的一种定位页面的方式，即url地址上#标识，通过锚点值的不同可以定位到html页面中不同位置；此方式值的变化不会产生向服务端发起请求，前端利用更改值的变化来映射到对应需要展示的页面数据；主要思路利用监测window.onhashchange与window.location.hash来控制值变化的监听以及对值的更改；这种方式

    hash的事件onhashchange触发场景：对于行为导致hash值变化都会触发此事件，地址的直接变化hash值，前进后退导致的hash变化都会触发

    history模式：这种方式html5中提出高级语法，从地址模式来说比与常规的地址相同，更加真实，但本身并不会直接触发页面改变；利用pushState来添加新历史记录，利用onpopstate来观测地址栏间的历史记录切换变化，利用replaceState来切换已存在的历史为当前替换地址；通过history.length可查看到浏览器历史记录

    相同的触发：都会在操作前进后退（history.back(), history.forward(), history.go()）时触发，但触发原理点不同

    注意点：在history模式下通过pushState下创建的带锚点方式并不会触发hash触发事件，但当url中hash锚点变化时会触发onpopstate事件，由于hash值的变化会导致历史记录指针移动，在历史记录切换下变化都会导致onpopstate事件的触发


    由于hash变化操作的是#后面变化，页面刷新和初次打开都不会携带hash值请求后端，请求地址以源地址为主，只要源地址存在不会导致后端404；history模式改变了源地址展示，则会出现请求地址后端不存在返回404，需要配置服务器地址打回到首页；前端可以通过配置防错路由组件

  - **DOM树**

    数据的传输通过网络进程传入，页面的渲染通过渲染进程来完成，两者之间的过程是将网络数据格式转换为浏览器可识别过程，HTML parser是对HTML解析器，这个过程编译转换的过程

    数据 -> HTML Parser -> browser render to Dom

    - DOM树是什么

      文档对象模型，浏览器通过解析HTML之后所形成的节点对象模型，其作用作为了在HTML和javascript之间的衔接，为我们建立了如何通过脚本对文档进行操作

    - DOM树产生

      在经过网路进程将数据字节码之后展示在浏览器的过程中，单纯的字节码是不能够正常的让浏览器解析出来，在这个过程中字节码怎样转换为浏览器可识别的代码，中间的过程也是一个分析解析的过程；这里谈到了编译原理的对语言的转换过程，在整个数据流拼接完成后，首先将原始的字节码进行分词解析，经过分词后以单个分词的状态存在，通过栈的管理方式来进行解析建立各个词之间关系，在进栈前会对分词标签类型已经锁定，并将分词压入栈同时创建了对应的节点，并将节点加入到创建的DOM中，匹配到已入栈分词的结尾词时，进行将该词弹出栈，在这个过程反复中栈顶指向当前词类型为元素类型分词，从进出栈的过程中可以清晰的分析到最终节点之间的关系。在栈清空后则整个DOM树也就建立完成了

    - css, js对DOM影响

      在解析过程中当解析到的词为js的script词时，对内嵌脚本会阻塞htmlDom解析器解析html过程，并调入javascript引擎分析脚本，而当遇到的是外链入脚本地址，则会通过先下载的过程，再进行js引擎解析，下载的过程在高级浏览器有的会提供预解析功能进行预载入来加快这也过程，事实这也过程也是会阻塞熬html的解析；当HTML解析过程中在js脚本解析到前遇到了css标签，即会阻断HTML解析，也会影响到脚本的解析，在分析过程脚本有可能会对CSS产生依赖操作，为了保证流程不混乱，会等待CSS解析完成，再进行HTML解析；所以可以很明确的知道html解析受限于脚本，与css，脚本的解析受限于css。

    - 性能的提升

      通过前面介绍，可以很清晰的知道，在浏览器渲染的过程中对于HTML的解析有影响的点，对于脚本我们即可以通过对脚本的压缩，合并等提高对脚本的下载速度，另一方面通过调整脚本位置来减少对页面的解析阻断，又或者通过将脚本的异步载入，加入高级语法标签async与defer模式来提高对下载过程与HTML解析过程的并行处理；对css尽量化放入页面首部，一方面加快对css的载入过程，对于css内容不多情况下可以直接内嵌，减少加载的过程，直接进入解析过程

  - **事件模型**

    事件传播：事件捕获，目标对象，事件冒泡

  - **浏览器缓存机制**

    缓存的目为了更快的获取资源，使的页面能更快速显示，节省带宽；浏览器的缓存主要是通过http头信息来标识完成的，通过浏览器http中约定的开启启动标识来使浏览缓存功能生效；以http请求和响应头信息为主

    缓存分为：强缓存，协商缓存

    - 强缓存

      强缓存是为了在指定时间内，浏览缓存没过期的情况下，不需要向服务端发起资源请求，而是读取本地缓存信息；强缓存开启方式通过在HTTP响应头信息中添加Expires或者Cache-control,Expires为HTTP1.0版本所提供的缓存开启标识，Cache-control则是HTTP1.1版本提供的标识，在同时预设时，后者优先高于前者，两种标识区别主要Expires模式设定的是具体时间，并且是建立在服务器端时间，而对于客户端时间的比对是否过期是建立在客户端，因此在两端时间出现问题不准确情况下会出现导致缓存失效问题，因此提出了Cache-control方式来提高稳定性，其设置的时间是相对时间以秒为单位。

    - 协商缓存

      协商缓存是建立在强缓存失效情况下，客户端携带服务器端第一次返回的响应标识，再次向服务端发起请求，通过比较响应标识与服务端标识进行比对，建立在Last-Modified与If-Modified-Since时间间的比对, ETag与If-None-Match数据唯一标识的比对，来绝对是否返回状态200或者304来通知是否读取本地以缓存的数据

    **流程梳理：在客户端第一次访问时本地缓存中没有缓存规则和缓存内容，向服务器端发起请求，服务端通过设置Expires与Cache-control来开启强缓存，并设置Last-Modified与ETag来标识数据最后一次修改时间与数据的唯一标识，在返回给客户端的情况下，会将规则与结果存储到缓存库中，当下一次客户端获取资源时，会先从本地缓存库查看是否有缓存规则，若有会分别对Expires或者Cache-control规则定义的时间比对时间，看是否过期，若没有过期则直接返回本地缓存库资源，若过期，则规则中存在标识头If-Modified-Since与If-None-Match时，则会携带规则向服务器端发起请求，服务器端会通过与本地标识进行唯一标识或者时间比对，若变化了，则重新返回新数据与响应规则，并以状态200通知客户端，若没有变化则只返回状态码304来告诉客户端本，并读取本地缓存数据作为响应内容。**

    - 缓存来源

      缓存来源：内存缓存与磁盘缓存

      资源的读取来源由内存到磁盘

      当资源第一次完成解析后文件会读入相应的进程内存中缓存起来，当进程没有关闭时，是一直存在的；所以当在刷新页面重新请求会发现标识资源展示from memory cache; 当资源存储在磁盘或者内存中没有会从磁盘来读取资源，并展示from disk cache

  - **Chrome浏览器架构**

  - **浏览器工作原理**

  - **内存泄露**

    - 什么是内存泄露

      内存是在对一个应用系统启动时操作系统分配给应用的存储资源的空间，这个空间是逻辑上的意义，不是物理上的意义，通过建立逻辑与物理直接的映射关系而形成的地址映射到真是的硬件设备上；内存的泄露是指程序中不再占用的内存空间没有得到回收给系统，导致内存中资源还一直存在，内存不能释放，当出现过多的情况后，导致内存分配不够，严重的会导致系统奔溃

      内存溢出：内存溢出由于无法为应用分配内存；

      内存泄露严重导致内存溢出

    - 内存管理

      内存的管理建立在内存的分配，内存的使用，内存的释放；部分语言是需要手动来开启分配内存和释放内存例如c语言，对js语言在内存分配和释放都是自动的，不需要开发人员手动完成，当我们声明一个变量，对象等时会自动触发为其分配一定的内存，当不在使用时会释放；在对释放的管理中引入了垃圾回收，即是对不需要的内存进行回收的一种算法策略，这种方式也不是js本身所具有的模式，而是依赖的执行环境所提供的一种方法；

      垃圾回收模式中的算法：

        - 引用计数

          这种方式是早期的一种收集回收策略算法，主要是通过对对象的计数，对象的计数为0时将认为该对象没有被其他所引用，进而被回收；但不适用于循环引用造成的情况；在循环引用中主要产生了两个对象间的互相引用，这样彼此的计数是不为0，造成无法被回收

        - 标记与清除

          标记算法的是针对了早期引用计数的弊端而改进的方式，一方面解决了循环引用导致不能回收的问题，因为标记算法的主思想是对对象的不可访问而作为是否可以将其收回释放，通过同根节点建立开始标记是否从根节点可访问到对象，访问到的被标记，当遍历结束后，没有被标记的将被作为可销毁对象处理。对于0引用对象必定是不可访问，可销毁，但对于不可访问不一定是0引用；

          清除的算法产生也是为了补充标记中的一些不良好的结果，由于在释放的过程中可能产生内存之间的不连续性，导致收集的内存不能合并为一个空间，这样在后期为其他应用进行分配的内存时候由于不连续的空间造成分配不能利用内存，甚至导致内存不够无法分配，清除也是为了解决在收集后对内存空间的整理，将碎片的内存空间之间合并并形成连续的空间，为下一次分配更好的利用

    - 编写中的问题

      虽然环境为我们提供了释放内存的算法处理方式，但何时触发垃圾回收，如果更好的可以让垃圾回收更好的回收不需要的内存，触发的过程是很难预知的，但对于我们的书写方式下会决定是否可以更好的被回收，当我们在代码中编写不合理会导致一些不需要的资源一直存在，不符合垃圾回收，这样就会造成内存的泄露。

        归纳为：

        - 导致不需要的变量，对象等一直存在根对象环境下

        - 长期运行环境不释放导致所依赖的变量作用环境也不能释放

        - 对象引用的长期建立，导致对应的值对象不能释放，例如缓存的长期保留，对dom节点的引用存储，即使后期节点删除，但节点依然存在关联

## CSS

  - **盒模型**

    盒子模型是通过围绕内容进行margin, border, padding设置形成盒子模型；

    盒子模型具有标准模式和怪异模式，模式不同浏览器的解析方式不同，标准模式针对现在高级浏览器，怪异模式针对ie低版本浏览器；

    标准模式: width = content width

    怪异模式: width = border + padding + width

    对于设置盒模型模式，通过box-sizing（border-box，padding-box, content-box标准模式）；模式的不同对于盒子的计算基准是不同的；

    样式的获取方式：

      document.style -> 对标签内嵌样式的获取

      document.currentStyle -> 对在ie浏览器下获取计算后的样式

      window.getComputedStyle -> 对在标准浏览器下获取计算后的样式

      document.getBoundingClientRect -> 获取元素对于视口左上角的距离，以及盒子自身的一些属性值

  - **BFC, IFC**

    BFC： block format context(块级格式上下文)，即使盒子形成独立的环境，不产生对其他外层盒子的影响，外层也不产生对内层影响，形成独立的上下文环境；

    开启盒子BFC：

      - 使overflow不为visible

      - 使float不为none

      - 使position不为static或者relative

      - display属性为inline-block,table,table-cell,table-caption,flex,inline-flex

    场景：

      - 常规两个盒子在对于上下边距问题产生折叠优先为最大设置值；解决方式通过隔离平级盒子，使不属于同一BFC环境下，对该盒子外层嵌套一层触发其BFC

      - 浮动元素，在同级盒子中，一个盒子浮动脱离文档流，另一个盒子受气影响，使受影响盒子触发BFC模式，BFC模式盒子不会受浮动影响

      - 由于子盒子浮动导致父盒子高度计算问题，使父盒子触发BFC模式，可正常计算高度


    IFC：inline format context(行级格式上下文)，即是对形成行级环境下，行级标签的渲染环境；通过块级包裹行级元素形成，内部行级元素有自己的渲染模式，外层形成了IFC环境

      - 行级元素之间上下不受纵向样式影响

      - 行级元素横向排列，根据外层设置text-align居中排列

      - 行级元素有设置Float的优先排列

    总结：

      由于标签模式，块级标签，行级标签，以及之间的转换，在组合方式下形成块级与行级，块级与块级，行级与行级方式；组合的方式也形成了相应的渲染方式，块级元素主要还是来完成布局，BFC模式也是针对在块级标签下组合的独立环境渲染的环境场景，而IFC模式对于行级标签的渲染的环境场景，主要是针对文本性的内容的控制。

  - **css选择器**

    id选择器，class选择器，元素选择器，属性选择器，伪类选择器，伪元素选择器，后代选择器，组合选择器

    属性选择器：[attr^=value], [attr$=value], [attr*=value]

    伪类选择器：

      伪类即通过元素:方式形成的模式，伪类即对元素在某个状态的行为设定 a:hover, a:focus等

    伪元素选择器：

      伪元素即通过元素::方式形成模式，伪元素即对元素在其特定部分进行样式设定 p::first-line

    后代选择器：

      p > a后代元素选择

      p + a 直接相邻一个元素

      p ~ a 相邻的其他元素

    组合选择器：以上方式的组合模式

    选择器优先级：

      id[1000], class属性选择器、属性选择器[100]，元素选择器[1], *[0]

      行内 > 内嵌 > 外链

      import 提升优先级，但并不建议使用

      通过组合计算得到优先级值

          关于css样式优先级规则

            单项规则：!important > id > class=[attribute]=:class>tag=:element
            组合规则以父子.div div，父直接孩子.div > div，相邻.div + div
            组合规则优先级，计算作用到标签上的策略，最大的生效；若相等的则最近的生效

          注意：父对子的样式影响主要在子继承了父样式，或者父优先级高于子，处理方式以提升子优先级高于父，
               继承情况下以子复写父样式，或者父子独立话样式


  - **position**

    文档流有常规文档流和非常规文档流，常规文档流即标签的初始类型所决定的形成的展示方式，比如块级则通栏展示，行级则水平排列，不足时折行展示；对于布局情况的需求下，以非常规文档流的方式打破原标签的排列模式，以浮动，定位为代表

    定位：通过设定参数(static, relative, absolute, fixed, sticky)不同决定标签的布局特性

    静态定位(static): 这种方式和以往常规方式是相同模式

    相对布局(relative): 这种方式元素并不脱离常规文档流，会占据常规文档流位置空间，但可以通过独立设置来改变元素的位置，即相对于常规流情况下个偏移

    绝对布局(absolute): 这种方式元素脱离了常规文档流，不占据常规文档流的位置空间，可灵活的设置其位置，相对于最近父级设置的position非static下偏移

    固定布局(fixed): 这种模式元素脱离常规文档流，不占据常规文档流的位置空间，相对于根级定位(视口)

    粘粘布局(sticky): 这种方式新提出的方式，基本模式类似于fixed，但主要运用于对设定标题上吸顶效果

  - flexible

    自定义适应，以一维管理布局，通过高级语法完成布局

    主轴，交叉轴：默认主轴为水平方向，交叉轴以垂直为主轴方向建立，通过flex-direction:[row/row-reverser, col/col-reverser], 当确定主轴，交叉轴也就确定。水平不产生拉伸，垂直产生拉伸；主轴默认以从左到右排列

    flex-grow/flex-shrink: 扩大与收缩

    flex-wrap: nowrap(默认值) 默认情况下以排列一行或者一列，多余的不产生折行排列，会自动伸缩完成适应，通过设置来改变行为

    flex-basis: 设定内部元素模块大小，在设定的情况下，收缩基础建立在此值上产生

    align-items/justify-content: 对于垂直与水平方向的元素排列间的间距和位置

  - layout

    容器的居中方式：

    - flex+align-items(center)+justify-content(center)

    - width+margin 0 auto 水平居中

    - width+position(left:50%,right:50%)+margin(top:-width/2, left:-width/2)

    - width+position(left:50%, right:50%)+transform(translate(-50%,-50%))

    - width+position(left:auto,top:auto,right:auto,bottom:auto)

    容器内容居中：

    - 设置容器padding间距

    - 设置容器text-align:center

    - 设置容器vertical-align: middle

    - 设置容器display: table/table-cell+text-align+vertical-align

    圣杯布局：

      通过浮动三栏，目的是让三栏可以并齐底部，通过外层设置左右padding值为左右栏目值大小，这是为了保证中间内容在左右栏两边外自动适应，通过对左右栏定位设置左负宽值，间距负100%，右父宽值，间距负宽值来避免遮挡中间内容

    ```css
      *{padding:0;margin:0}
      .header,.footer{
        height: 80px;
        min-width: 500px;
        line-height:80px;
        text-align: center;
        color: white;
      }
      .header{
        background-color: red;
      }
      .footer{
        background-color: black;
      }
      .containter{
        padding: 0 220px 0 200px;
        overflow: hidden;
        min-width: 500px;
      }
      .left,.right,.middle{
        float:left;
        height: 100%;
        word-break: break-all;
        min-height: 520px;
      }
      .left{
        width: 200px;
        position: relative;
        left: -200px;
        margin-left: -100%;
        background-color: green;
      }
      .right{
        width: 220px;
        position: relative;
        right: -220px;
        margin-left: -220px;
        background-color: yellow;
      }
      .middle{
        width:100%;
        background-color: pink;
      }
    ```

    ```html
      <div class="header">header</div>
      <div class="containter">
        <div class="middle">
          我是中间内容
        </div>
        <div class="left">
          left
        </div>
        <div class="right">
          right
        </div>
      </div>
      <div class="footer">footer</div>
    ```

    双飞翼布局

      模式与圣杯方式相同，不同点在于中间的自适应实现不同，不使用定位方式，只是单纯的三栏浮动，通过在内容区添加一个div，完成对div的左右间距设置为左右栏目宽

    ```css
      *{padding:0;margin:0}
      .header,.footer{
        height: 80px;
        min-width: 500px;
        line-height:80px;
        text-align: center;
        color: white;
      }
      .header{
        background-color: red;
      }
      .footer{
        background-color: black;
      }
      .containter{
        overflow: hidden;
      }
      .left,.right,.middle{
        float:left;
        height: 100%;
        word-break: break-all;
        min-height: 520px;
      }
      .left{
        width: 200px;
        margin-left: -100%;
        background-color: green;
      }
      .right{
        width: 220px;
        margin-left: -220px;
        background-color: yellow;
      }
      .middle{
        width:100%;
        min-width: 420px;
        background-color: pink;
      }
      .middle-innter{
        margin:0 220px 0 200px;
      }
    ```

    ```html
      <div class="header">header</div>
      <div class="containter">
        <div class="middle">
          <div class="middle-innter">我是中间内容</div>
        </div>
        <div class="left">
          left
        </div>
        <div class="right">
          right
        </div>
      </div>
      <div class="footer">footer</div>
    ```
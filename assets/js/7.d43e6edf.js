(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{340:function(v,_,p){"use strict";p.r(_);var t=p(33),l=Object(t.a)({},(function(){var v=this,_=v.$createElement,p=v._self._c||_;return p("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[p("h2",{attrs:{id:"计算机基础知识"}},[p("a",{staticClass:"header-anchor",attrs:{href:"#计算机基础知识"}},[v._v("#")]),v._v(" 计算机基础知识")]),v._v(" "),p("ul",[p("li",[p("p",[v._v("进程")]),v._v(" "),p("p",[v._v("进程是分配资源的最小分配单位；进程主要是起到沙箱的作用，形成一个封闭的动态程序执行环境，可以对需要的任务合理分配和管理相关资源，进程由数据，程序，进程块组成，数据是任务需要操作的内容，程序则起到了任务的执行，进程块则记录了进程相关的一些信息，比如进程ID，进程运行状态相关信息；进程是程序的一个动态概念，程序是静态的，进程是程序执行开始的活动状态；")]),v._v(" "),p("p",[v._v("计算机中可以根据系统cpu的情况来开决定是否开启多进程工作，提高任务的吞吐量，提高执行效率，合理的运用是可以加快程序处理任务的能力")])]),v._v(" "),p("li",[p("p",[v._v("线程")]),v._v(" "),p("p",[v._v("线程是处理运算任务的最小分配单位，线程包含于进程中，可以有多线程也可以有单线程，线程之间共享了进程中的资源，但线程工作的失败会影响到其他线程，线程不具有封闭性，但可以作为处理并发多任务的一种方式，线程也有相应的线程块信息用来记录线程的信息，线程间的切换效率高，相比进程上下文切换会开销很大，因为进程没一次切换前都要对当前状态信息进行更新到对应的进程块中记录，频繁操作率高")]),v._v(" "),p("p",[v._v("不管是线程还是进程都可以通过父亲来控制儿子")])]),v._v(" "),p("li",[p("p",[v._v("进程间通信")]),v._v(" "),p("ul",[p("li",[p("p",[v._v("管道")]),v._v(" "),p("p",[v._v("管道其实就是在内存中开辟了一个缓存区，通过在缓存区里放入信息，两端与要通信的进程相连，信息的流向为单项进行，一端写入，一端读出；由操作系统内核开辟这个缓存区，由于是内核开辟内存，对于可缓存的数量是有限的也就是处理数据量是有限制，所谓双工是说两端都可以作为输入端输出端，但需要建立双通道来完成；")]),v._v(" "),p("p",[v._v("无名管道：主要是建立在有关系的进程之间，父子关系进程，例如pipe方法的实现，通过一段开启了read,一段开启了write")]),v._v(" "),p("p",[v._v("命名管道：主要是通过对管道进行了索引与磁盘位置建立映射，进程只需要有相关权限可以操作这个磁盘进行读写内容，对于建立的映射需要手动删除")]),v._v(" "),p("p",[v._v("无名管道与命名管道区别: 一个针对有关系的进程，一个针对无关系之间进程通信，建立的方式不太一样，一个内存缓存方式，当执行完就会关闭销毁；另一个是建立磁盘映射为手动开启，执行完成后还需要手动删除")])]),v._v(" "),p("li",[p("p",[v._v("消息队列")]),v._v(" "),p("p",[v._v("通过建立一个队列内部可以通过将可提供权限访问的进程将消息写入到队列链表中，并标识每一个内容的类型，在需要其他进程访问的时候通过一定的标识来读取链表中的指定内容")]),v._v(" "),p("p",[v._v("待补充：实际运用中的理解")])]),v._v(" "),p("li",[p("p",[v._v("信号")]),v._v(" "),p("p",[v._v("信号的方式是软件层面上的一种类似中断的模式，通过发起信号事件，来通知接受到指定信号事件的回调函数执行，类似发布订阅模式")]),v._v(" "),p("p",[v._v("待补充：实际运用中的理解")])]),v._v(" "),p("li",[p("p",[v._v("信号量")]),v._v(" "),p("p",[v._v("信号量为一个数字量，主要是为了解决进程的同步和互斥，即一个资源只能由一个进程操作，当该进程没有释放，其他进程不能操作，信号通过进程的申请而计数减一，通过进程对资源的释放来计算加一，这样形成了进程之间的互斥，但保证之间的信息同步化")]),v._v(" "),p("p",[v._v("待补充：实际运用中的理解")])]),v._v(" "),p("li",[p("p",[v._v("socket")]),v._v(" "),p("p",[v._v("通过建立端到端连接，利用了网络之间的信息传输建立来完成，进程可以在一个主机上也可以不在同一个主机上，主机间的通信最终建立在主机地址之间的消息传递，也就是mac地址完成, 同网段中通过arb方式广播完成，非同网段通过路由引导到指定的主机，在指定主机的网段中进行arb方式完成广播，这里host决定了主机位置，端口决定了通信入口位置，可以理解为端口即一个进程任务的决定位置，socket的组成也是建立在这两个方面上的")])])])]),v._v(" "),p("li",[p("p",[v._v("进程调度策略")])]),v._v(" "),p("li",[p("p",[v._v("死锁")])]),v._v(" "),p("li",[p("p",[v._v("IO多路复用")])]),v._v(" "),p("li",[p("p",[v._v("OSI七层协议")]),v._v(" "),p("ul",[p("li",[p("p",[v._v("应用层")])]),v._v(" "),p("li",[p("p",[v._v("表示层")])]),v._v(" "),p("li",[p("p",[v._v("会话层")])]),v._v(" "),p("li",[p("p",[v._v("传输层")]),v._v(" "),p("p",[v._v("传输层解决了在端到端传输数据过程中的数据包的")])]),v._v(" "),p("li",[p("p",[v._v("网络层")]),v._v(" "),p("p",[v._v("由于网路的组合并不是单纯的局域网，而是由多个子网组合而成的一个庞大的网络，每一个设备具有独立的地址编号(MAC地址)，而每一个设备在网络中也为其分配了一个唯一的IP地址，代表了在网络中的位置；网络层就是在这种情况下产生，并在这层做了相关的协议约定来如何处理IP数据包; 网络层突出了多主机之间的建立")])]),v._v(" "),p("li",[p("p",[v._v("数据链路层")]),v._v(" "),p("p",[v._v("在物理层的基础上单纯的以传输0，1没有太大意义，通过约定了一些协议来完成建立一组电信号来进行传播，完成如果组合0，1来完成使的传输的信息具有一定的意义，以以太网来将各自传输模式统一为通用模式；")]),v._v(" "),p("p",[v._v("以太网方式包含头和数据，头信息中主要是发送端和接收端两边的MAC地址和IP地址；数据则为传输的报文")])]),v._v(" "),p("li",[p("p",[v._v("物理层")]),v._v(" "),p("p",[v._v("主要是建立设备之间的物理连接，通过光纤，电缆，无线波等，建立电信号，为传输信息以0，1二进制提供物理条件")])])])]),v._v(" "),p("li",[p("p",[v._v("HTTP")]),v._v(" "),p("p",[v._v("http0.9: 只支持get方法，没有请求头，结构简单")]),v._v(" "),p("p",[v._v("http1.0：添加了其他请求方法，添加了请求头信息（状态码，状态信息，http版本号，content-type内容类型）")]),v._v(" "),p("p",[v._v("http1.1：主要完善了网络性能提升；开启了keep-alive长连接，防止每次连接都要重新建立tcp三次握手；管道化可以发起请求并不是必须等待响应可再次发起请求；chunked response,以块响应内容，内容响应完成后返回响应后的介绍标识EOF来通知结束；添加了其他头信息标识(accept, language, host)完善头信息标识；添加了options预检功能，针对cors方式")]),v._v(" "),p("p",[v._v("已经支持的连接模式：")]),v._v(" "),p("div",{staticClass:"language- extra-class"},[p("pre",[p("code",[v._v("传统短连接 -> 单纯的每一次请求创建一次连接即tcp握手\n\n长连接复用 -> 通过请求头标识connection: keep-alive 完成开启，多个请求任务共享一此tcp握手\n\n服务器Push模式 -> 早期是通过响应content-length来标识内容响应结束，现在通过chunked response模式响应内容块，以最红EOF标识通知信息响应结束\n\nwebsocket -> 建立服务端与客户端之间的双工通信模式\n")])])]),p("p",[v._v("http2.0")]),v._v(" "),p("p",[v._v("性能上的增强，内容格式上的，推送服务")]),v._v(" "),p("p",[v._v("将HTTP中的多任务请求改变为并行发起，而不是串性；之前的处理内容格式为文本格式，只是通过gzip进行了压缩传输，通过增加了以二进制方式传输来提升传输内容速度；推送服务主要是服务端可以提前将请求所依赖的资源提前反馈给客户端，并在客户端可以缓存起来;HPACK算法对多个任务的请求头若有重复会消除重复，整合压缩")]),v._v(" "),p("p",[v._v("http3.0")]),v._v(" "),p("p",[v._v("http1.1 具有多任务发起请求，若一个任务发生block，后期任务都block")]),v._v(" "),p("p",[v._v("http2.0 启动并行发起任务，一旦发生丢包，就会block住所有的HTTP请求")]),v._v(" "),p("p",[p("a",{attrs:{href:"https://coolshell.cn/articles/19840.html"}},[v._v("https://coolshell.cn/articles/19840.html")])])]),v._v(" "),p("li",[p("p",[v._v("HTTPS")])]),v._v(" "),p("li",[p("p",[v._v("TCP")])]),v._v(" "),p("li",[p("p",[v._v("UDP")])]),v._v(" "),p("li",[p("p",[v._v("加密方式")]),v._v(" "),p("ul",[p("li",[p("p",[v._v("散列")])]),v._v(" "),p("li",[p("p",[v._v("对称")])]),v._v(" "),p("li",[p("p",[v._v("非对称")])])])])])])}),[],!1,null,null,null);_.default=l.exports}}]);
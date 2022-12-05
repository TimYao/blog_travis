一、 关于多页面通信

- localStorage onStorage

利用了同域下窗口之间建立共享key值，以a，b页面同时开启onstorage事件，其中一个页面更新key值，触发另一个页面通信，问题点是页面是否打开，页面关闭销毁问题，打开我目前思路是通过监测页面onload这样保证了页面已经打开了，更新Key值通信到另一个页面，该页面更新值通信到加载的页面；关闭通过监测页面的onunload,onclose事件分别监听页面卸载和关闭状态

- window.open,window.opener

父页面要记录每一个window.open打开的页面，这样在通过postMessage,onMessage时可以过滤掉发送消息的页面，给其他窗口发送通信

- url

通过将通信传递借助url的query传入另一个页面，新页面利用收到的query参数完成操作通信

- shareWork

页面之间建立一个单独的共享线程，由于每一个页面引入共享线程，形成端口是不同的，这样存储端口来区分不同发起源，在发送时候过滤掉自己向其他端口发送

- boradCastChannel

通过在窗口中建立频道信息相同的频道，这样一端发送完成通知到其他

- websocket
通过中间服务端建立一个中转记录每一个连接到服务的客户端client,这样在发送时候过滤掉当前client,向其他连接client发送


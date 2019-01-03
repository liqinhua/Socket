// 思考的问题
//     1.检测心跳
//     2.避免ws重复连接
//     3.及时关闭WebSocket(onbeforeunload在即将离开当前页面(刷新或关闭)时执行)
//     4.有新消息怎么传出去 -> 回调(暂时不做)

export class Socket {
    constructor ({url, timeout = 12000, responseTime = 3000, anewTime = 3000, heartTit = 'heart'}) {
        this.ws = null; // webSocket
        this.url = url; // 连接的url
        this.timeout = timeout; // 默认两分钟分钟检测心跳
        this.responseTime = responseTime; // 心跳检测回应时间
        this.anewTime = anewTime; // 连接失败从新连接的时间
        this.heartTit = heartTit; // 心跳检测文本
        this.linkStatus = null; // 连接状态
        this.isLink = true; // 是否需要继续连接
        this.checkStatus = null; // 防止重复检测心跳
        this._createdWebsocket()
    }
    // 创建连接
    _createdWebsocket () {
        this.ws = new WebSocket(this.url)

        // 连接成功
        this.ws.onopen = (evt) => {
            // 检测心跳
            this._heartCheck()
            // 如果需要连接成功需要回调，可以传进来
        }

        // 连接失败后的回调函数
        this.ws.onerror = (evt) => {
            setTimeout(() => {
                this._createdWebsocket()
            }, 3000)
        }

        // 监听断开连接
        this.ws.onclose = (evt) => {
            console.log('监听断开', evt)
            // 处理某些需要直接关闭的需求
            if (!this.isLink) return
            this._createdWebsocket()
        }

        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接
        window.addEventListener("beforeunload", (event) => {
            this._clone('Y')
            this.isLink = false
        });
    }
    // 关闭连接
    _clone (parm) {
        // 直接关闭，不需要继续连接了
        if (parm == 'Y') {
            this.isLink = false
        }
        this.ws.close()
    }
    // 心跳检测
    _heartCheck () {
        // 标记检测状态，避免重复检测
        if (this.checkStatus) {
            return
        }
        this.checkStatus = true
        setTimeout(() => {
            this.linkStatus = null
            this.ws.send(this.heartTit)
            setTimeout(() => {
                this.checkStatus = null
                // 如果接口有响应，又重新开启检测
                if (this.linkStatus) {
                    this._heartCheck()
                } else {
                    // 如果接口没有响应，直接退出
                    this._clone()
                }
            }, this.responseTime)
        }, this.timeout)
    }
}

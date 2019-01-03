# WebSocket
如果你的需求只考虑WebSocket，那么它是你比较满意的选择。简单，方便

使用说明：

    import {Socket} from 'Socket'

    let ws = new Socket({url: url})

    ws.ws.onmessage = function (evt) {
        console.log('监听新消息', evt)
        // 连接状态->告诉心跳正常
        ws.linkStatus = true

    }


参数

    {
        url: url, // 连接的url
        timeout: '', // 默认两分钟分钟检测心跳
        responseTime: '', // 心跳检测回应时间
        anewTime: '', // 连接失败重新连接的时间
        heartTit: '', // 心跳检测文本
    }


转换成es5语法(babel)

    npm install

    npm run build

    得到的list就是转成功的文件
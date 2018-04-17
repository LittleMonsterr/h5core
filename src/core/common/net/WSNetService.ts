module junyou {
    /**
     * WebSocket版本的NetService
     * @author builder
     */
    export class WSNetService extends NetService {

        private _ws: WebSocket;
        private index: number = 1;
        /**
         * 
         * 接收到的数据缓存
         * @private
         * @type {Uint8Array}
         */
        private _recievedBuffer: Uint8Array;

        // /**
        //  * 
        //  * 数据缓存的读取索引
        //  * @private
        //  * @type {number}
        //  */
        // private _readPosition: number = 0;

        constructor() {
            super();
            //覆盖instance
            NetService._ins = this;
        }

        /**
         * 
         * 设置websocket地址
         * @param {string} actionUrl
         */
        public setUrl(actionUrl: string) {
            if (this._actionUrl != actionUrl) {
                this._actionUrl = actionUrl;
                let ws = this._ws;
                if (ws) {
                    ws.close();
                }
                if (ws && ws.readyState <= WebSocket.OPEN) { //已经有连接，重置连接
                    this.connect();
                }
            }
        }

        public disconnect() {
            let ws = this._ws;
            if (ws) {
                ws.close();
            }
        }

        /**
        * 打开新的连接
        */
        public connect() {
            let ws = this._ws;
            if (ws) {
                ws.onclose = null;
                ws.onerror = null;
                ws.onmessage = null;
                ws.onopen = null;
            }
            try {
                ws = new WebSocket(this._actionUrl);
            } catch (err) {
                if (Global.isDebug) {
                    console.log("无法连接服务器");
                }
                return;
            }
            this._ws = ws;

            ws.binaryType = "arraybuffer";
            ws.onclose = this.onClose;
            ws.onerror = this.onError;
            ws.onmessage = this.onData;
            ws.onopen = this.onOpen;
        }

        private _tryTimes: number = 1;
        private _conn: boolean = false;

        protected onOpen = () => {
            this._ws.onopen = null;
            if (Global.isDebug) {
                //获取项目名
                let localSrc = document.location.toString();
                localSrc = localSrc.substr(0, localSrc.indexOf("web") - 1);
                localSrc = " " + localSrc.substr((localSrc.lastIndexOf("/") + 1), localSrc.length) + " ";
                console.log(localSrc + "webSocket连接成功");
            }
            dispatch(EventConst.Connected);
        }

        /**
         * 
         * 发生错误
         * @protected
         */
        protected onError = (ev: ErrorEvent) => {
            if (DEBUG) {
                ThrowError("socket发生错误", ev.error);
            }
            dispatch(EventConst.ConnectFailed);
        }

        /**
         * 
         * 断开连接
         * @protected
         */
        protected onClose = (ev: CloseEvent) => {
            if (Global.isDebug) {
                //获取项目名
                let localSrc = document.location.toString();
                localSrc = localSrc.substr(0, localSrc.indexOf("web") - 1);
                localSrc = " " + localSrc.substr((localSrc.lastIndexOf("/") + 1), localSrc.length) + " ";
                console.log(localSrc + "socket断开连接");
            }
            dispatch(EventConst.Disconnect);
            //this.connect();
        }

        /**
         * 
         * 收到消息
         * @private
         */
        private onData = (ev: MessageEvent) => {
            let ab = new Uint8Array(<ArrayBuffer>ev.data);
            let rb
            if (this._recievedBuffer) {
                rb = this._recievedBuffer;
            } else {
                rb = new Uint8Array(0);
            }

            let rbLen = rb.length;
            let abLen = ab.length;
            let newRecieved = new Uint8Array(rbLen + abLen);
            let i = 0, m: number;
            for (m = 0; m < rbLen; m++) {
                newRecieved[i++] = rb[m];
            }
            for (m = 0; m < abLen; m++) {
                newRecieved[i++] = ab[m];
            }
            let readBuffer = this._readBuffer;

            readBuffer = new ByteArray();
            readBuffer.buffer = newRecieved.buffer;
            readBuffer.position = 0;
            this.decodeBytes(readBuffer);
            this._recievedBuffer = new Uint8Array(readBuffer.buffer.slice(readBuffer.position));
        }

        protected _send(cmd: number, data?: any, msgType: string = "") {
            var pdata = this._sendDataPool.getInstance();
            pdata.flag = 0;
            pdata.content = PBMessageUtils.writeTo(data, msgType); //先把proto数据保存为ByteArray
            pdata.id = this.index++;
            pdata.type = cmd;
            var sendBuffer = this._sendBuffer;
            sendBuffer.clear();
            sendBuffer = PBMessageUtils.writeTo(pdata, "GameMsg")  //再封装为固定格式 GameMsg
            let sendPool = this._sendDataPool;
            sendPool.recycle(pdata);
            var realsend = new ByteArray; //最后再把GameMSG（含长度）封装起来，发送数据。
            var len = sendBuffer.length;
            realsend.writeVarint(len);
            realsend.writeBytes(sendBuffer);
            realsend.position = 0;

            let now = new Date();
            let time = DateUtils.getFormatTime(now.getTime(), "HH:mm:ss");

            if (cmd != 1001) {
                if (Global.isDebug || DEBUG) {
                    this.$writeNSLog(now.getTime(), msgType, "send", cmd, data);
                }

            }

            try {
                this._ws.send(realsend.buffer);
            } catch (error) {
                ThrowError("send socket error");
            }
        }
    }
}
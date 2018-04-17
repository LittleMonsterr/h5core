module junyou {

	/**
	 * 用于发送的网络数据<br/>
	 * @author 3tion
	 */
	export class NetSendData implements IRecyclable {
        /**
         * 协议号
         */
        public cmd: number;

    	/**
    	 * 数据
    	 */
		public content: any;
	
		public id:number;
		public flag:number;

		/**
		 * 
		 * protobuf message的类型
		 * @type {string | number}
		 */
		public type: string | number;

        public onRecycle() {
            this.content = undefined;
			this.type = undefined;
        }
	}
	/**
	 * 网络数据，类似AS3项目中Stream<br/>
	 * @author 3tion
	 *
	 */
    export class NetData extends NetSendData {

    	/**
    	 *  是否停止传播
    	 */
        public stopPropagation: Boolean;
    }
}

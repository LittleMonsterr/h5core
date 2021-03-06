module junyou {
    export const enum SlotCountShow {
        /**
         * 不显示文本
         */
        NotShow = 0,
        /**
         * 显示文本
         */
        Show = 1,
        /**
         * 自定义显示
         * 会调用 Slot.getCountString进行处理
         */
        Custom = 2
    }

    /**
     * 格位基本类
     * @author pb
     */
    export class Slot extends Component {
        public bg: egret.Bitmap;
        protected icon: Image;
        protected _countTxt: egret.TextField;
        protected _rect: egret.Rectangle;

        protected _iconSource: string;
        protected _count = 1;
        protected _countShow = SlotCountShow.Show;
        protected _countInvalidate = true;
        protected _changed: boolean;

        protected _data: any;

        constructor() {
            super();
            this.icon = new Image();
        }

        /**
         * 
         * 获取类型2的数量处理方法
         * @static
         */
        public static getCountString = (count: number) => count < 1 ? "" : count < 10000 ? count + "" : LangUtil.getMsg("$_wan", Math.floor(count / 10000));

        public set data(value: any) {
            this.$setData(value);
        }

        /**
         * 设置数据，只允许子类调用
         * @protected
         */
        $setData<T>(value: T) {
            this._data = value;
        }

        public get data() {
            return this._data;
        }

        public set rect(rect: egret.Rectangle) {
            if (rect) {
                this._rect = rect;
                let icon = this.icon;
                icon.x = rect.x;
                icon.y = rect.y;
                icon.width = rect.width;
                icon.height = rect.height;
            }
        }

        public get rect(): egret.Rectangle {
            return this._rect;
        }


        public set countTxt(txt: egret.TextField) {
            let old = this._countTxt;
            if (old != txt) {
                removeDisplay(old);
                this._countTxt = txt;
                this.refreshCount();
                this.invalidateDisplay();
            }
        }

        public get countTxt(): egret.TextField {
            return this._countTxt;
        }

        public set iconSource(uri: string) {
            if (this._iconSource != uri) {
                this._iconSource = uri;
                this.icon.source = uri;
            }
        }

        public set count(value: number) {
            if (this._count != value) {
                this._count = value;
                this.refreshCount();
            }
        }

        /**
         * 数量显示状态<br/>
         * 0 不显示数值<br/>
         * 1 默认显示大于1的数量<br/>
         * 2 大于1的数量，显示数值，超过一万的，会以xxx万显示 默认为2<br/>
         */
        public set countShow(value: SlotCountShow) {
            if (this._countShow != value) {
                this._countShow = value;
                this.refreshCount();
            }
        }

        public get countShow(): SlotCountShow {
            return this._countShow;
        }

        private refreshCount() {
            if (this.stage) {
                this._countInvalidate = true;
            }
            if (this._countInvalidate && this._countTxt) {
                this._countTxt.text = this.getCount();
                this._countInvalidate = false;
            }
        }

        private getCount(): string {
            let str = "";
            switch (this.countShow) {
                case SlotCountShow.NotShow:
                    str = "";
                    break;
                case SlotCountShow.Show:
                    if (this._count > 1) {
                        str = this._count + "";
                    } else {
                        str = "";
                    }
                    break;
                case SlotCountShow.Custom:
                    str = Slot.getCountString(this._count);
                    break;
            }
            return str;
        }

        public invalidateDisplay() {
            this._changed = true;
            if (this.stage) {
                Global.callLater(this.refreshDisplay, 0, this);
            }
        }

        protected refreshDisplay() {
            if (!this._changed) {
                return false;
            }
            this._changed = false;
            if (this.bg) {
                this.addChild(this.bg);
            }
            this.addChild(this.icon);
            if (this._countTxt) {
                this.addChild(this._countTxt);
            }
            return true;
        }

        /**
         * 皮肤添加到舞台
         * to be override
         */
        public awake() {
            this.refreshDisplay();
            this.refreshCount();
        }

        /**
         * 销毁
         * to be override
         */
        public dispose() {
            this.icon.dispose();
            super.dispose();
        }

        get width() {
            return this.suiRawRect.width;
        }
        get height() {
            return this.suiRawRect.height;
        }
    }
}
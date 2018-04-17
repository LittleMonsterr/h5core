module junyou {
	/**
	 *
     * /**
	 * 下拉菜单创建器
	 * @author 
	 *
	 */
	
    export class ComboBoxCreator extends BaseCreator<ComboBox>{
        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            this._createT = () => {
                let cb = new ComboBox();
                cb.txt = this.createElement(data[0]) as egret.TextField;
                cb.textbg = this.createElement(data[1]) as ScaleBitmap;
                cb.btn = this.createElement(data[2]) as Button;
                return cb;
            }
        }
    }
}

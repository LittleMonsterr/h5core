module junyou {
	export class ComboBox extends Component {
		public constructor() {
			super();
		}

		public textbg: ScaleBitmap;

		public btn: Button;

		public txt: egret.TextField;

		public bindChildren() {
			this.addChild(this.textbg);
			this.addChild(this.btn);
			this.addChild(this.txt);
			this.listbg = singleton(SuiResManager).createDisplayObject("lib", "bmd.scale9.YellowTextBG") as ScaleBitmap;
			this.btn.bindTouch(this.onBtnTouch, this);
		}

		public listbg: ScaleBitmap;

		public list: PageList<any, any>;

		private _isOpen: boolean = false;

		private _extra: any;

		public get isOpen() {
			return this._isOpen;
		}
		public set isOpen(value: boolean) {
			if (this._isOpen == value) return;
			this._isOpen = value;
			if (value) {
				this.showList();
			} else {
				this.hideList();
			}
		}

		public labelFunction: Function;

		public createList(pageList: PageList<any, any>, offx: number = 0, offy: number = 0) {
			let list = this.list = pageList;
			let textbg = this.textbg;
			list.x = textbg.x + offx;
			list.y = textbg.y + textbg.height + offy;
			this.list.on(EventConst.ITEM_SELECTED, this.onItemSelect, this);
			this.list.on(egret.TouchEvent.TOUCH_TAP, this.onItemTouch, this);
		}

		protected onItemTouch = (e: egret.Event) => {
			this.isOpen = false;
		}

		protected onItemSelect = (e: egret.Event) => {
			this.isOpen = false;
			this.dispatch(EventConst.COMBOBOX_ITEM_SELECTED);
		}

		protected onBtnTouch(e: egret.Event) {
			this.isOpen = !this.isOpen;
			this.dispatch(EventConst.COMBOBOX_BTN_TOUCHTAP);
		}

		/**显示 */
		protected showList() {
			let textbg = this.textbg;
			let bg = this.listbg;
			bg.x = textbg.x;
			bg.y = textbg.y + textbg.height;
			this.addChild(bg);
			this.addChild(this.list);
		}

		/**隐藏 */
		protected hideList() {
			this.removeChild(this.listbg);
			this.removeChild(this.list);
			this.showLabel();
		}

		/**显示label */
		public showLabel() {
			let data = this.getSelectData();
			if (this.labelFunction) {
				this.txt.text = this.labelFunction(data);
			} else {
				this.txt.text = String(data);
			}
		}

		/**当前数据 */
		public getSelectData() {
			return this.list.selectedItem.data;
		}

		public setData(data: any[], moren?: number, labelFunction?: Function) {
			this.list.displayList(data);
			this.list.selectedIndex = moren ? moren : 0;
			let bg = this.listbg;
			bg.width = this.list.width;
			bg.height = this.list.height;
			this.labelFunction = labelFunction;
			this.showLabel();
		}

		public setListBg(uri: string, className: string) {
			let bg = singleton(SuiResManager).createDisplayObject(uri, className) as ScaleBitmap;
			this.listbg = bg;
		}

		public set listBgWidth(value: number) {
			this.listbg.width = value;
			this.list.x = (this.listbg.width - this.list.width) >> 2
		}

		public get listBgWidth(): number {
			return this.listbg.width;
		}

		public get extra() {
			return this._extra;
		}
		public set extra(value: any) {
			this._extra = value;			
		}


	}
}
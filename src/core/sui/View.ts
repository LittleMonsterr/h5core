module junyou {
    export class View extends egret.Sprite {
        public constructor(key: string, className: string) {
            super();
            singleton(SuiResManager).createComponents(key, className, this);
        }
    }
}
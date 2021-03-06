module junyou {

    /**
     * 区段 -1000 - -1999
     * 
     * @export
     * @enum {number}
     */
    export const enum EventConst {

        /**
         * 大小发生改变
         */
        Resize = -1999,
        /**
         * 执行强制重排面板
         */
        ReLayout = -1998,
        /*===============================ListItemRender====================================*/
        /**
        * 选中未选中
        * 
        * @static
        * @type {string}
        */
        CHOOSE_STATE_CHANGE = -1000,
        /**
         * List中单击事件
         */
        ITEM_TOUCH_TAP = -1001,

        /*===============================Group====================================*/
        /**
         * 分组发生改变
         */
        GROUP_CHANGE = -1020,

        /**
         * 尝试多选选中时，已经达到最大数量
         */
        GROUP_FULL = -1021,
        /*===============================NumbericStepper/Slider====================================*/
        VALUE_CHANGE = -1040,

        /*===============================SCROLLER/PAGE====================================*/
        PAGE_CHANGE = -1050,

        SCROLL_POSITION_CHANGE = -1051,

        ITEM_SELECTED = -1052,
        
        COMBOBOX_ITEM_SELECTED = -1053,
        COMBOBOX_BTN_TOUCHTAP = -1054,

        /*=====================================FLIP======================================== */
        /**
         * 翻页操作结束  
         * event.data 背面面积/正面面积
         */
        FlipEnd = -1060,

        /*======================================SuiBmd=========================================== */

        /**
         * SuiBmd纹理加载失败  
         * event.data 为资源的 uri
         */
        SuiBmdLoadFailed = -1070,
    }
}
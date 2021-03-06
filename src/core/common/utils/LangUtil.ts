var $errorcode;
module junyou {
    export interface LangUtilInterface {
        /**
         * 获取显示的信息
         * 
         * @static
         * @param {(number | string)} code code码
         * @param {any} args 其他参数  替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
         * @returns 显示信息
         */
        getMsg(code: number | string, ...args);
        /**
         * 
         * 注册语言字典
         * @param {{ [index: string]: string }} data 
         * @memberof LangUtilInterface
         */
        regMsgDict(data: { [index: string]: string });

        /**
         * 
         * 注册语言字典
         * @param {{ [index: string]: string }} data 
         * @memberof LangUtilInterface
         */
        loadCode();
    }

    /**
     * 用于处理语言/文字显示
     */
    export const LangUtil: LangUtilInterface = (function () {
        let _msgDict: { [index: string]: string } = {};
        return {
            /**
             * 获取显示的信息
             * 
             * @static
             * @param {Key} code code码
             * @param {any} args 其他参数  替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
             * @returns 显示信息
             */
            getMsg(code: Key, ...args) {
                if (code in _msgDict) {
                    return _msgDict[code].substitute(...args)
                }
                return typeof code === "string" ? code.substitute(...args) : code + "";
            },

            /**
             * 
             * 注册语言字典
             * @static
             * @param { { [index: string]: string }} data
             */
            regMsgDict(data: { [index: string]: string }) {
                //_msgDict = data;
                loadScript(ConfigUtils.getParam("code"), () => {
                    _msgDict = $errorcode;
                    // 清理脏字原始数据
                    $errorcode = undefined;
                })
            },

            loadCode() {
                loadScript(ConfigUtils.getParam("code"), () => {
                    
                    this.regMsgDict($errorcode);
                    // 清理脏字原始数据
                    $errorcode = undefined;
                })
            }
        }
    })()
}
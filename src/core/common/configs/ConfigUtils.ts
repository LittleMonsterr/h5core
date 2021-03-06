module junyou {

    export interface Path {
        /**
         * 路径
         * 
         * @type {string}
         * @memberOf Path
         */
        path: string,

        /**
         * 处理后的路径
         * 
         * @type {string}
         * @memberOf Path
         */
        tPath: string,
        /**
         * 是否忽略前缀
         * 
         * @type {boolean}
         * @memberOf Path
         */
        iPrefix?: boolean,
        /**
         * 父路径的标识
         * 
         * @type {string}
         * @memberOf Path
         */
        parent?: string;

    }

    export interface JConfig {
        /**
         * 参数字典  
         * key      {string}    标识
         * value    {any}       对应数据
         * 
         * @type {{}}
         * @memberOf JConfig
         */
        params?: {},
        /**
         * 前缀字典
         * 
         * @type {string[]}
         * @memberOf JConfig
         */
        prefixes: string[],
        /**
         * 路径
         * 
         * @type {{
         *             res: Path,
         *             skin: Path,
         *             [indes: string]: Path
         *         }}
         * @memberOf JConfig
         */
        paths: {
            res: Path,
            skin: Path,
            [indes: string]: Path
        };
    }

    /**
     * 配置工具
     * @author 3tion
     * @export
     * @class ConfigUtils
     */
    export const ConfigUtils = (function () {

        /**
         * 配置数据
         */
        let _data: JConfig;

        /**
         * 资源的hash配置
         */
        let _hash: { [index: string]: string };

        /**
         * 注册的皮肤路径  
         * key      {string}   皮肤的key
         * value    {Path}    皮肤实际路径地址
         */
        let _regedSkinPath = {} as { [index: string]: Path };
        let getPrefix: { (uri: string): string };
        /**
         * 设置配置数据
         * 
         * @static
         * @param {JConfig} data 配置
         */
        return {
            setData(data: JConfig) {
                _data = data;
                !_data.params && (_data.params = {})
                //检查路径是否存在有路径有父路径的，如果有，进行预处理
                let paths = _data.paths;
                for (let key in paths) {
                    let p = paths[key];
                    p.tPath = getPath(p);
                }
                //检查前缀
                getPrefix = (function (prefixes: string[]) {
                    let len = 0;
                    if (prefixes) {
                        len = prefixes.length;
                    }
                    switch (len) {
                        case 0:
                            return uri => "";
                        case 1: {
                            let prefix = prefixes[0];
                            return uri => prefix;
                        }
                        default:
                            return uri => {
                                let idx = uri.hash() % prefixes.length;
                                return prefixes[idx] || "";
                            }
                    }
                })(_data.prefixes)

                function getPath(p: Path) {
                    let parentKey = p.parent;
                    if (parentKey) {
                        let parent = paths[parentKey];
                        if (parent) {
                            return getPath(parent) + p.path;
                        } else if (DEBUG) {
                            ThrowError(`路径[${p.path}]配置了父级(parent)，但是找不到对应的父级`);
                        }
                    }
                    return p.path;
                }
            },


            /**
             * 获取资源完整路径
             * 
             * @static
             * @param {string} uri                  路径标识
             * @param {Boolean} [sameDomain=false]  是否为同域，同域的话，资源从resource中获取
             * @returns {string}
             */
            getResUrl(uri: string, sameDomain?: boolean): string {
                if (sameDomain) {
                    return "resource/" + uri;
                }
                if (_hash) {
                    let ver = _hash[uri];
                    if (ver) {
                        if (uri.indexOf("?") == -1) {
                            uri = uri + "?" + ver;
                        }
                        else {
                            uri = uri + "&jyver=" + ver;
                        }
                    }
                }
                return getUrlWithPath(uri, _data.paths.res);
            },
            /**
             * 获取参数
             */
            getParam(key: string): any {
                return _data.params[key];
            },
            getSkinPath,
            /**
             * 获取皮肤文件地址
             */
            getSkinFile(key: string, fileName: string) {
                return getUrlWithPath(getSkinPath(key, fileName), _regedSkinPath[key] || _data.paths.skin);
            },
            /**
             * 设置皮肤路径
             * 如 `lib` 原本应该放在当前项目  resource/skin/ 目录下  
             * 现在要将`lib`的指向改到  a/ 目录下  
             * 则使用下列代码
             * ```typescript
             * ConfigUtils.regSkinPath("lib","a/");
             * ```
             * 如果要将`lib`的指向改到 http://www.xxx.com/a/下  
             * 则使用下列代码
             * ```typescript
             * ConfigUtils.regSkinPath("lib","http://www.xxx.com/a/",true);
             * ```
             * 如果域名不同，`自行做好跨域策略CROS`
             * 
             * @param {string} key 
             * @param {string} path 
             * @param {boolean} [iPrefix] 是否忽略皮肤前缀
             */
            regSkinPath(key: string, path: string, iPrefix?: boolean) {
                _regedSkinPath[key] = { tPath: path, path, iPrefix };
            },
            /**
             * 获取路径
             * 
             * @param {string} uri 
             * @param {string} pathKey 
             * @returns 
             */
            getUrl(uri: string, pathKey: string) {
                let path = _data.paths[pathKey];
                if (path) {
                    return getUrlWithPath(uri, path);
                }
            }
        }

        /**
         * 获取皮肤路径
         * 
         * @param {string} key 
         * @param {string} fileName 
         * @returns 
         */
        function getSkinPath(key: string, fileName: string) {
            return key + "/" + fileName;
        }

        /**
         * 通过Path获取完整url
         * 
         * @private
         * @static
         * @param {string} uri 路径标识
         * @param {Path} path Path对象
         * @returns
         */
        function getUrlWithPath(uri: string, path: Path) {
            if (/^((http|https):)?\/\//.test(uri)) {//如果是http://或者https://，或者//开头，即为完整地址，不加前缀
                return uri;
            }
            uri = path.tPath + uri;
            let prefix = path.iPrefix ? "" : getPrefix(uri);
            return prefix + uri;
        }

    })()
}
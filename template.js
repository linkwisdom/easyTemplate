    /**
     * 前端模板解析，支持命名空间，转义解析
     * @param {object} temps 已经解析为模板列表的对象
     */
    function Template(temps) {

        //转义模板
        for (var item in temps) {
            var arr = temps[item];
            for (var i = 0, l = arr.length; i < l; i++) {
                var tp = arr[i].replace(/%\]/g, '>');
                arr[i] = tp.replace(/\[%/g, '<');

            }
        }

        /**
         * 解析命名空间内的对象属性，简化版本不支持三级命名空间
         * @param {Array} ts 将属性命名空间.分割成的数组如 $h.review.star 分割成[h,review,star]
         * @param {Object} data 数据对象，包含了模板 的数据对象
         * @param {rst} 用于保存结果的数组
         */
        function relay(ts, data, rst) {
            var t = ts.shift();
            var dd = data;
            while ( t in dd) {
                var temp = dd[t];
                //只能打印单值类型，字符串，数字和布尔类型。
                if (('string' == ( typeof dd[t]) ) 
                    || ('number' == ( typeof dd[t]) ) 
                    || ('boolean' == ( typeof dd[t]) )
                 ) {

                    rst.push(dd[t]);
                    break;
                }

                //如果二级属性不存在, 传递空字符串，且退出迭代过程
                if (dd[t][ts[0]] === undefined) {
                    rst.push('');
                    break;
                }

                //通过while探询更深层的属性
                if (ts.length > 0) {
                    dd = dd[t];
                    t = ts.shift();
                }
            }
        }

        /**
         * 模板绑定
         * @param {object} data 数据，
         * @param {array} arr已解析为数组的模板
         */
        this.bind = function(data, arr) {
            var rst = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                var t = arr[i];
                var c = t.charAt(0);
                if (c == '$') {
                    t = arr[i].substr(1);
                    var ts = t.split('.');
                    if (ts.length > 1) {
                        relay(ts, data, rst);
                    }
                    else if (t in data) {
                        rst.push(data[t]);
                    }
                }
                else if (c != '/') {
                    rst.push(t);
                }
            }
            return rst.join('');
        };
    }

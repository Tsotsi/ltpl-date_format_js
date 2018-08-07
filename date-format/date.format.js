"use strict";
jQuery.extend({
    _format: 'Y/m/d',
    _d: null,
    _format_reg: [
        /^(\d+)(([\D]+(\d+)|[\D]+(\d+)[\D]+(\d+))|)$/
    ],
    /**
     *
     * @date or string or int d
     * @string format like  Y/m/d
     */
    f: function (d, s) {
        if (arguments.length < 1) {
            throw new Error("至少一个参数");
            return false;
        }
        if (typeof d !== 'string' && typeof d !== 'number' && (typeof d === 'object' && !d instanceof Date)) {
            throw new TypeError('d的类型仅限Date,string,number');
            return false;
        }
        if (arguments.length > 1 && typeof s === 'string') {
            this._format = s;
        }
        this._d = d;
        return this._do();
    },
    _do: function () {
        if (typeof this._d !== 'string') {
            return this.fmtDate(this._format, this._d);
        }
        for (var i in this._format_reg) {

            var res = this._format_reg[i].exec(this._d);
            if (res) {
                var year = res[1];
                if (year.length < 4) {
                    var y = new Date().getFullYear();
                    year = y.toString().substr(0, 4 - year.length) + year;
                }
                var month = res[4] || (res[5] || 0);
                month = month > 0 ? month - 1 : 0;
                var day = res[6] || 0;
                var d = new Date(year, month, day);
                return this.fmtDate(this._format, d);
            }
        }
        return this._d;
    }

});
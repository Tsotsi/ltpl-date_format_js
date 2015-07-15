/*
 * format string   
 */
"use strict";
jQuery.extend({
        fmtDate: function () {
            if (arguments.length <= 2) {
                this._formatD = typeof arguments[0] !== 'undefined' ? arguments[0] : "";
                this._times = typeof arguments[1] !== 'undefined' ? arguments[1] : new Date();
                if (typeof this._formatD != 'string') {
                    throw new TypeError("jQuery.fmtDate:the first param must be string or null");
                    return;
                }
                this._formatD = $.trim(this._formatD);
                if (typeof this._times == 'number') {
                    this._times = new Date(this._times);
                }
                if (this._times instanceof Date === false) {

                    throw new TypeError("jQuery.fmtDate:the second param must be number or a instanceof Date");
                    return;
                }
                this._resultD = this._formatD;
                this._initTime();
                return this._fmtTime();

            } else {
                console.error("jQuery.date neads less than 2 params");
            }
        },
        _initTime: function () {
            //console.log('in jquery date |');
            //console.log(this._times.getTimezoneOffset());
//            console.log(this._times.UTC());
//            console.log(this._times.getUTCMilliseconds());
//            console.log(this._times.getTime());
//            console.log(this._times.parse());
//            console.log(this._times.getYear());
//            console.log(this===jQuery);
//            console.log(typeof this._times );
//            console.log(new Date() instanceof Date);


            this._weekD = this._times.getDay();//from week day
            this._dayD = this._times.getDate();//from month day
            this._hoursD = this._times.getHours();
            this._minutesD = this._times.getMinutes();
            this._monthD = this._times.getMonth();
            this._secondsD = this._times.getSeconds();
            this._yearD = this._times.getYear();
            this._timezoneoffsetD = this._times.getTimezoneOffset();
            return this._times.getHours();
        },
        _fmtTime: function () {
            this._replaceYear();

            this._replaceWeek();
            this._replaceDay();
            this._replaceTime();
            this._replaceMonth();
            this._resultD = this._resultD.replace(/^(.*?)(\$e|\$c)?$/gi, '$1');
            return this._resultD;
        },
        /*
         * L 表示是否闰年  0  非 1 是
         * Y 是4位
         * y 是2位
         */
        _replaceYear: function () {

            this._replaceFunc('L', this._isRunNian());
            //-->Y
            this._replaceFunc('Y', this._yearD + 1900);
            //-->y

            var my = this._yearD.toString();
            my = my.length > 1 ? my.replace(/^\d*(\d{2})$/g, '$1') : '0' + my;

            this._replaceFunc('y', my);

        },
        /*
         * d  表示月份中的第几天 有前导0
         * j  表示月份中的第几天 无前导0
         * w  表示星期中的第几天  0(星期日)-6
         * z   表示年份中的第几天
         */
        _replaceDay: function () {
            var s = new Date(1900 + this._yearD, 0, 0);
            var days = (this._times.getTime() - s.getTime()) / 1000 / 3600 / 24;
//-->z
            this._replaceFunc('z', Math.floor(days));
//-->d
            var ddt = this._dayD > 9 ? (this._dayD).toString() : '0' + (this._dayD).toString();
            this._replaceFunc('d', ddt);
            //-->j
            this._replaceFunc('j', this._dayD);
            //-->w
            this._replaceFunc('w', this._weekD);


        },
        _replaceWeek: function () {

        },
        /*
         * format 结尾时$c 表示中文 $e 表示英文 不区别大小写 
         * F 月份  完整的文本
         * m 表示月份  有前导0
         * n 表示月份  无前导0
         * t 表示给定月份的天数
         */
        _replaceMonth: function () {
            var i18n = {
                0: {
                    0: '一月',

                    1: '二月',

                    2: '三月',

                    3: '四月',

                    4: '五月',

                    5: '六月',

                    6: '七月',

                    7: '八月',

                    8: '九月',

                    9: '十月',

                    10: '十一月',

                    11: '十二月'
                }, 1: {
                    0: 'January',

                    1: 'February',

                    2: 'March',

                    3: 'April',

                    4: 'May',

                    5: 'June',

                    6: 'July',

                    7: 'August',

                    8: 'September',

                    9: 'October',

                    10: 'November',

                    11: 'December'
                }
            };
            var choose = 0;
            var flag = this._resultD.substr(-2, 2);
            if (flag === '$c' || flag === '$C') {
                choose = 0;
            }
            if (flag === '$e' || flag === '$E') {
                choose = 1;
            }

            //-->m
            var month_t = (this._monthD + 1).toString();
            month_t = month_t.length > 1 ? month_t : '0' + month_t;

            this._replaceFunc('m', month_t);
            //-->n

            this._replaceFunc('n', (this._monthD + 1).toString());
            //-->t

            this._replaceFunc('t', this._alnDays(this._monthD + 1, this._yearD + 1900));
            //-->F

            this._replaceFunc('F', i18n[choose][this._monthD]);
        },
        /*
         * g    小时 12小时制 无前导0
         * G    小时 24小时制 无前导0
         * h    小时 12小时制 有前导0
         * H    小时 24小时制 有前导0
         * i    有前导0的分钟数
         * s    有前导0的秒
         */
        _replaceTime: function () {
            //-->g
            this._replaceFunc('g', this._hoursD > 11 ? this._hoursD - 12 : this._hoursD);
            //-->G
            this._replaceFunc('G', this._hoursD);
            //-->h
            var tmph = (this._hoursD > 11 ? this._hoursD - 12 : this._hoursD).toString();
            this._replaceFunc('h', tmph.length > 1 ? tmph : '0' + tmph);
            //-->H
            var tmpH = (this._hoursD).toString();
            this._replaceFunc('H', tmpH.length > 1 ? tmpH : '0' + tmpH);
            //-->i
            var tmpi = this._minutesD.toString();
            this._replaceFunc('i', tmpi.length > 1 ? tmpi : '0' + tmpi);
            //-->s
            var tmps = this._secondsD.toString();
            this._replaceFunc('s', tmps.length > 1 ? tmps : '0' + tmps);
        },
        _isRunNian: function (year) {
            if (year)
                var y = year;
            else
                var y = 1900 + this._yearD;

            var r = 0;
            if ((y % 4 == 0 && y % 100 != 0) || (y % 400 == 0)) {
                r = 1;
            }
            return r;
        },
        _replaceTMP: function (str) {
            var regBL = /\{\&\&\}/g;
        },
        _alnDays: function (mon, year) {
            var res = 0;
            if (mon < 8) {
                if (mon == 2) {
                    res = this._isRunNian(year) ? 29 : 28;
                } else {
                    res = mon % 2 == 0 ? 30 : 31;
                }
            } else {
                res = mon % 2 == 0 ? 31 : 30;
            }
            return res;
        },
        _replaceFunc: function (str, place) {
            var reg3 = new RegExp(str, 'g');///j/g;
            var regY3 = new RegExp('\{' + str + '\}', 'g');///j/g;
            var regBL = /\{\&\&\}/g;
            var reStr = str;//'{'+str+'}';

            this._resultD = this._resultD.replace(regY3, '{&&}');
            this._resultD = this._resultD.replace(reg3, place);
            this._resultD = this._resultD.replace(regBL, reStr);
        },
        getTgdz: function (t) {
            var gz = ['庚子', '辛丑', '壬寅', '癸丑', '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥',
                '壬子', '癸丑', '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥',
                '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥',
                '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛己', '壬午', '癸未', '甲申', '乙酉', '丙戌', '丁亥',
                '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳', '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥'];
            var wx = ['金', '木', '水', '火', '土'];
            var sx = ['子鼠', '丑牛', '寅虎', '卯兔', '辰龙', '巳蛇', '午马', '未羊', '申猴', '酉鸡', '戌狗', '亥猪'];
            var sc = ['子时', '丑时', '寅时', '卯时', '辰时', '己时', '午时', '未时', '申时', '酉时', '戊时', '亥时'];
            var b = t || this._times;
            if (b instanceof Date === false) {
                b = new Date();
            }

        }


    }
);
        

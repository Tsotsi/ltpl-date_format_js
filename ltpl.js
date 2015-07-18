/**
 * Created by Tsotsi on 2015/7/17.
 */
!function () {
    "use strict";
    var configs = {
        openTag: '{{',
        closeTag: '}}',
        error: function (e, log) {
            console.error(e + (typeof log != 'undefined' ? '  msg :' + log : ''));
        }
    };
    var parseTag = [
        '#\\s*?[\\w\\.]+?\\s*(|\\s*\\|\\s*([\\w\\.]+?))',
        '\\s*?[\\w\\.]+?\\s*(|\\s*\\|\\s*([\\w\\.]+?))',
        '?for\\s+([\\w\\.]+?)\\s+as\\s([\\w]+?)(\\s*?|\\s+?[\\w]+?\\s*?)\\s*?',
        '/for\\s*?'
    ];

    var exp = function (strExp, _, __, isPure) {
        _ = _ || '';
        __ = __ || '';
        isPure = isPure || false;
        return new RegExp(_ + (isPure ? '' : configs['openTag']) + strExp + (isPure ? '' : configs['closeTag']) + __, 'g');
    };
    var helper = {
        entityencode: function (str) {
            if (typeof str != 'string') {
                return '';
            }
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
        },
        escape: function (str) {
            if (typeof str != 'string') {
                return '';
            }
            return str.replace(/([\'\"\\])/g, '\\$1');
        },
        _prev_for: function () {

            return exp(configs['openTag'] + parseTag[2] + configs['closeTag'] + '([\\s\\S]*?)' + configs['openTag'] + parseTag[3] + configs['closeTag'], '(', ')+', true);
        }

    };
    var Tpl = function (tpl) {
        this.tpl = tpl;
        this.cache = null;
    };
    Tpl.pt = Tpl.prototype;
    Tpl.pt.parseTpl = function (data, callback) {
        var that = this;
        var _v = this.helper.escape(this.tpl);
        _v = '_view="' + _v.replace(/\<\!--[\s\S]*?--\>/g, '').replace(/[\r\n]/g, '').replace(/(\s)\s*/g, '$1').replace(exp(parseTag[0], '(', ')+'), function (match, p, p1, pipe) {
                var s = 'this.helper.entityencode(';
                var e = ')+"';
                if (pipe && !/^\s+$/.test(pipe)) {
                    if (typeof that.helper[pipe] == 'function') {
                        s = 'this.helper.' + pipe + '(' + s;
                    } else {
                        s = pipe + '(' + s;
                    }
                    e = ')' + e;
                    match = match.replace(p1, '');
                }
                match = match.replace(/\s/g, '').replace(exp(configs['openTag'], '', '#', true), '";_view+=' + s).replace(exp(configs['closeTag'], '', '', true), e);
                return match;
            }).replace(exp(parseTag[1], '(', ')+'), function (match, p, p1, pipe) {
                var s = '';
                var e = '+"';
                if (pipe && !/^\s+$/.test(pipe)) {
                    if (typeof that.helper[pipe] == 'function') {
                        s = 'this.helper.' + pipe + '(' + s;
                    } else {
                        s = pipe + '(' + s;
                    }
                    e = ')' + e;
                    match = match.replace(p1, '');
                }
                match = match.replace(/\s/g, '').replace(exp(configs['openTag'], '', '', true), '";_view+=' + s).replace(exp(configs['closeTag'], '', '', true), e);
                return match;
            }).replace(this.helper._prev_for(), function (match, p, data, k, v, body) {
                match = '";for(var ' + k + ' in ' + data + '){var ' + v + '=' + data + '[' + k + '];_view+="' + body + '";};"';
                return match;
            });
        _v += '";';
        if (typeof callback == 'function') {
            _v += 'callback();';
        }
        _v += 'return _view;';
        try {
            this.cache = new Function('d', 'callback', _v);
            return this.cache(data, callback);
        } catch (e) {
            this.cache = null;
            configs.error('can not parseTpl', e);

        }
    };
    Tpl.pt.render = function (data, callback) {
        return typeof this.cache == 'function' ? this.cache(data, callback) : this.parseTpl(data, callback);
    };
    Tpl.pt.renderDom = function (data, callback) {
        var _t = document.getElementById(this.tpl);
        this.tpl = _t ? _t.innerHTML : '';
        return this.render(data, callback);
    };
    Tpl.pt.helper = helper;

    var ltpl = function (tpl) {
        typeof tpl != 'string' && configs.error('Template must be string');

        return new Tpl(tpl);
    };
    ltpl.config = function (cnf) {
        cnf = cnf || {};
        for (var i in cnf) {
            configs[i] = cnf[i];
        }
    };
    ltpl.helper = function (idx, func) {
        helper[idx] = func;
    };
    ltpl.v = '1.0 alpha';
    window.ltpl = ltpl;
}();

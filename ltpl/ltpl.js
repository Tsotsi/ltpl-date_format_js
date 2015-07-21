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
        '#\\s*?[\\w\\.\\[\\]]+?\\s*(|\\s*\\|\\s*([\\w\\.]+?))',
        '\\s*?[\\w\\.\\[\\]]+?\\s*(|\\s*\\|\\s*([\\w\\.]+?))',
        '\\s*?for\\s+([\\w\\.]+?)\\s+as\\s([\\w]+?)(\\s*?|\\s+?[\\w]+?\\s*?)\\s*?',
        '/for\\s*?',
        '[\\s\\S]+?',
        '\\s*?if\\s*?\\(\\s*?([\\s\\S]+?)\\s*?\\)\\s*?',
        'else\:',
        '/if\\s*?'
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
        unescape: function (str) {
            if (typeof str != 'string') {
                return '';
            }
            return str.replace(/\\([\'\"\\])/g, '$1');
        },
        _prev_for: function () {

            return exp( parseTag[2] + configs['closeTag'] + '('+parseTag[4]+')' + configs['openTag'] + parseTag[3] , '(', ')+');
        },
        _prev_if:function(){
          return exp(parseTag[5]+configs['closeTag']+ '('+parseTag[4]+')' + '('+configs['openTag'] + parseTag[6] + configs['closeTag']+'|)'+ '('+parseTag[4]+')' + configs['openTag'] + parseTag[7],'(',')+');
        },
        _clear: function (str, s, e, _) {
            _ = _ || '';
            s = s || '';
            e = e || '';
            return str.replace(/\s/g, '').replace(exp(configs['openTag'], '^', _, true), '";_view+=' + s).replace(exp(configs['closeTag'], '', '$', true), e);
        },
        _clear_sen: function (str, s, e) {
            s = s || '";';
            e = e || '_view+="';
            return str.replace(exp(configs['openTag'], '^', '', true),  s).replace(exp(configs['closeTag'], '', '$', true), e);
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
                return that.helper._clear(match, s, e, '#');
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
                return that.helper._clear(match, s, e);
            }).replace(this.helper._prev_for(), function (match, p, data, k, v, body) {
                return v ? '";for(var ' + k + ' in ' + data + '){var ' + v + '=' + data + '[' + k + '];_view+="' + body + '";};"' : '";for(var k in ' + data + '){var ' + k + '=' + data + '[k];_view+="' + body + '";};"';
            }).replace(exp('{'),'{_view+="').replace(exp('}'),'";}_view+="').replace(exp(parseTag[4],'(',')+'),function(match){
              console.info(match);
              return that.helper._clear_sen(that.helper.unescape(match), '', '');
            }).replace(this.helper._prev_if(),function(match,p,p1,p2,p3){
              // console.log(match,' : ',p,' : ',p1,' : ',p2,' : p3: ',p3);
            });
        _v += '";';
        if (typeof callback == 'function') {
            _v += 'callback();';
        }
        _v += 'return _view;';console.log(_v);
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

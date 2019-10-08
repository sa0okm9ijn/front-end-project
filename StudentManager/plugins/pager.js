/*
 * @Author: gexuerong 
 * @Date: 2019-10-02 11:53:14 
 * @Last Modified by: gexuerong
 * @Last Modified time: 2019-10-06 11:54:27
 */
if (!window.myPlugin) {
    window.myPlugin = {};
}
/**
 * 分页插件
 * 使用方法 var pager=new window.myPlugin.Pager({});
 */
window.myPlugin.Pager = (function () {

    /**
     * 创建一个页码对象 
     * @param {defaultOptions}  options 配置对象 
     */
    function Pager(options) {
        var defaultOptions = {
            total: 0,
            //总数据量
            current: 1,
            //当前页码
            limit: 10,
            //页容量
            container: document.querySelector('.pager'),
            //页码容器
            firstText: '首页',
            prevText: '上一页',
            nextText: '下一页',
            lastText: '尾页',
            panelNumber: 5,
            //分页面板中，数字页码最多有多少个
            onPageChange: null
        };
        //混入 mixin
        this.options = Object.assign({}, defaultOptions, options);
        this.show();
        this.regisEvent();
    }
    /**
     * 根据当前的页码，重新显示页码
     */
    Pager.prototype.show = function () {
        this.options.container.innerHTML = "";
        var disabled = "";
        if (this.options.current === 1) {
            disabled = " disabled";
        }
        this.createPagerItem(' first' + disabled, this.options.firstText);
        this.createPagerItem(' prev' + disabled, this.options.prevText);

        this.createNumbers();

        disabled = "";
        var pageNumber = this.getPageNumber();
        if (this.options.current === pageNumber) {
            disabled = " disabled";
        }

        this.createPagerItem(" next" + disabled, this.options.nextText);
        this.createPagerItem(" last" + disabled, this.options.lastText);

        var span = document.createElement('span');
        span.className = "pager-text";
        span.innerHTML = `<i class='current'>${this.options.current}</i>/<i class='total'>${pageNumber}</i>`;

        this.options.container.appendChild(span);

    }
    /**
     * 创建页签       
     * @param {*} extraClassName 额外样式
     * @param {*} content 内容
     */
    Pager.prototype.createPagerItem = function (extraClassName, content) {
        var a = document.createElement('a');
        a.className = 'pager-item' + extraClassName;
        a.innerText = content;
        this.options.container.appendChild(a);
        return a;
    }

    /**
     * 创建面板数字
     */
    Pager.prototype.createNumbers = function () {
        var min = this.options.current - Math.floor(this.options.panelNumber / 2);
        if (min < 1) {
            min = 1;
        }
        var max = min + this.options.panelNumber - 1;
        var pageNumber = this.getPageNumber();
        if (max > pageNumber) {
            max = pageNumber;
        }

        for (var i = min; i < max; i++) {
            var cls = "";
            if (i == this.options.current) {
                cls = ' active';
            }
            this.createPagerItem(' number' + cls, i);
        }
    }

    /**
     * 获取总页数
     */
    Pager.prototype.getPageNumber = function () {
        return Math.ceil(this.options.total / this.options.limit);
    }

    /**
     * 注册跳转事件
     */
    Pager.prototype.regisEvent = function () {
        var that = this;
        this.options.container.addEventListener('click', function (e) {
            if (e.target.classList.contains('first')) {
                that.toPage(1);
            } else if (e.target.classList.contains('prev')) {
                that.toPage(that.options.current - 1);
            } else if (e.target.classList.contains('next')) {
                that.toPage(that.options.current + 1);
            } else if (e.target.classList.contains('last')) {
                that.toPage(that.getPageNumber());
            } else if (e.target.classList.contains('number')) {
                that.toPage(parseInt(e.target.innerText));
            }
        });
    }
    /**
     * 跳转到指定页
     * @param {int} page 要跳转的页码 
     */
    Pager.prototype.toPage = function (page) {
        if (page < 1) {
            page = 1;
        }
        if (this.options.current === page) {
            return;
        }
        if(page > this.getPageNumber()){
            return;
        }
        this.options.current = page;
        this.show();
        if (this.options.onPageChange) {
            this.options.onPageChange();
        }
    }
    return Pager;
})();


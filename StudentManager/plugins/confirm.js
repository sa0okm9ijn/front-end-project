/*
 * @Author: gexuerong 
 * @Date: 2019-10-02 23:31:58 
 * @Last Modified by: gexuerong
 * @Last Modified time: 2019-10-04 19:33:51
 */


if (!window.myPlugin) {
    window.myPlugin = {};
}
/**
 * 打开消息确认框插件
 */
window.myPlugin.openConfirm = (function () {
    var options = {
        title: '提示',
        content: '这是一段确认消息',
        confirmClass: 'confirm',
        confirmText: '确定',
        cancelClass: 'cancel',
        cancelText: '取消',
        oncancel: null,
        onconfirm: null,
    }
    var imgBase64 = 'data:image/png;base64,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';
    //默认配置
    var divModal;
    //朦层
    var divCenter;
    //中间的容器

    var isRegEvent = false;
    //是否注册过事件

    /**
     * 打开一个确认的对话框
     * @param {*} opts 
     */
    function openConfirm(opts) {
        options = Object.assign({}, options, opts);
        initModal();
        initCenterDiv();
        regEvent();
    }
    /**
     * 注册事件
     */
    function regEvent() {
        if (isRegEvent) {
            return;
        }
        isRegEvent = true;
        //事件委托
        divModal.addEventListener('click', function (e) {
            if (e.target.dataset.mypluginId === 'close') {
                divModal.style.display = "none";
            }
            if (e.target === this) {
                divModal.style.display = "none";
            }
            if (e.target.dataset.mypluginId === 'confirm') {
                if (options.onconfirm) {
                    options.onconfirm();
                }
                divModal.style.display = "none";
            }
            if (e.target.dataset.mypluginId === 'cancel') {
                if (options.oncancel) {
                    options.oncancel();
                }
                divModal.style.display = "none";
            }
        }, false)
    }
    /**
     * 初始化一个朦层
     */
    function initModal() {
        if (!divModal) {
            divModal = document.createElement('div');
            divModal.style.position = "fixed";
            divModal.style.background = "rgba(0,0,0,0.2)";
            divModal.style.width = divModal.style.height = '100%';
            divModal.style.left = divModal.style.top = 0;
            document.body.appendChild(divModal);
        }
        divModal.style.display = "block";
    }
    /**
     * 初始化中间的div
     */
    function initCenterDiv() {
        if (!divCenter) {
            divCenter = document.createElement('div');
            divCenter.style.position = "absolute";
            divCenter.style.width = "260px";
            divCenter.style.height = "160px";
            divCenter.style.background = "#fff";
            divCenter.style.left = divCenter.style.right = divCenter.style.top = divCenter.style.bottom = 0;
            divCenter.style.margin = "auto";
            divCenter.style.fontSize = "14px";
            divModal.appendChild(divCenter);

            initDivCenterHeader();
            //初始化标题
            initDivCenterContent();
            //初始化内容
            initDivCenterBtn();
            //初始化button
        }
    }
    /**
     * 初始化中间的div标题部分
     */
    function initDivCenterHeader() {
        var div = document.createElement('div');
        div.style.height = "40px";
        div.style.background = '#eee';
        div.style.boxSizing = "border-box";
        div.style.padding = "10px 20px 0";
        div.innerHTML = `
        <span style='float:left;'>${options.title}</span>
        <span style='float:right;cursor:pointer'>
            <img data-myplugin-id='close' style='width:18px;height:18px;' src='${imgBase64}' />
        </span>
        `;
        divCenter.appendChild(div);
    }
    /**
     * 初始化中间的div内容部分
     */
    function initDivCenterContent() {
        var div = document.createElement('div');
        div.style.height = "70px";
        div.style.boxSizing = "border-box";
        div.style.padding = "20px";
        div.innerText = options.content;
        divCenter.appendChild(div);

    }
    /**
     * 初始化中间的div按钮部分
     */
    function initDivCenterBtn() {
        var div = document.createElement('div');
        div.style.height = "50px";
        div.style.boxSizing = "border-box";
        div.style.padding = "10px 20px";
        div.style.textAlign = "right";
        div.innerHTML = `
        <button data-myplugin-id='confirm' class='${options.confirmClass}'>${options.confirmText}</button>
        <button data-myplugin-id='cancel' class='${options.cancelClass}'>${options.cancelText}</button>
        `
        divCenter.appendChild(div);
    }
    return openConfirm;
})();
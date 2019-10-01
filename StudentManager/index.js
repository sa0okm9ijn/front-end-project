/*
 * @Author: gexuerong 
 * @Date: 2019-09-30 13:42:05 
 * @Last Modified by: gexuerong
 * @Last Modified time: 2019-09-30 15:52:23
 */

/**
 * 学生管理系统js版
 */
(function () {

    //当前页码
    var currentPage = 1;
    //每一页展示的条数
    var pageSize = 1;
    //总页数
    var allPage = 1;
    //默认的学生列表dom元素
    var studentListDom = document.querySelector('.menu-list').querySelectorAll('dd')[0];

    /**
     * 请求接口数据
     * @param {String} url 接口请求的地址 
     * @param {String} param  接口请求的参数
     */
    function request(url, param) {
        var result = null;
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        if (typeof param === 'string') {
            xhr.open('GET', url + '?' + param, false);
        } else if (typeof param === 'object') {
            var str = '';
            for (var prop in param) {
                str += prop + '=' + param[prop] + '&';
            }
            xhr.open('GET', url + '?' + str, false);
        } else {
            xhr.open('GET', url + '?' + param.toString(), false);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    result = JSON.parse(xhr.responseText);
                }
            }
        }
        xhr.send();
        return result;
    }

    /**
     * 请求接口的进一步封装
     * @param {String} url 请求地址 
     * @param {String} data  请求参数
     * @param {Function} success  请求成功的回调
     */
    function transferData(url, data, success) {
        var baseUrl = 'https://open.duyiedu.com';
        var response = request(baseUrl + url, Object.assign({
            appkey: 'sa0okm9ijn_1569813133048'
        }, data));
        if (response.status === 'success') {
            success(response);
        } else {
            alert(response.msg);
        }
    }

    /**
     * 渲染表格数据
     * @param {Array} data 待渲染的数据 
     */
    function renderTable(data) {
        var tBody = document.getElementById('table-body');
        var str = `<th colspan="8">No Data</th>`;
        data.forEach(function (item, index) {
            str = "";
            str += `<tr>
                        <td>${item.sNo}</td>
                        <td>${item.name}</td>
                        <td>${item.sex===0?'男':'女'}</td>
                        <td>${item.email}</td>
                        <td>${new Date().getFullYear()-item.birth}</td>
                        <td>${item.phone}</td>
                        <td>${item.address}</td>
                        <td>
                            <button class="btn edit">编辑</button>
                            <button class="btn delete">删除</button>
                        </td>
                    </tr>`;

        });
        tBody.innerHTML = str;
    }

    /**
     * 获取学生列表数据
     */
    function getTableData() {
        transferData('/api/student/findByPage', {
            page: currentPage,
            size: pageSize
        }, function (res) {
            var data = res.data.findByPage;
            renderTable(data);
        })
    }

    /**
     * 校验表单数据是否都有填写 返回一个对象  
     * 如果全部填写则返回{data: {}, msg: ''} 
     * 如果没有全部填写或者不符合规范 则返回{msg: '数据没有写全，请检查数据'}
     * @param {FormData} form 要校验的表单数据 
     */
    function formatForm(form) {
        var result = {
            data: {},
            msg: ''
        };
        var name = form.name.value;
        var sex = form.sex.value;
        var email = form.email.value;
        var sNo = form.sNo.value;
        var birth = form.birth.value;
        var phone = form.phone.value;
        var address = form.address.value;
        if (!name || !sex || !email || !sNo || !birth || !phone || !address) {
            result.msg = '数据没有写全,请检查数据';
        } else {
            result.data = {
                name,
                sex,
                email,
                sNo,
                birth,
                phone,
                address
            }
        }
        return result;

    }

    /**
     * 左侧导航样式重置,并给targetDom添加样式
     * @param {Document[]} listDom 导航菜单集合
     * @param {String} className  当选选中的样式名称
     * @param {Document} targetDom 需要设置的选中dom
     */
    function initStyle(listDom, className, targetDom) {
        for (var i = 0; i < listDom.length; i++) {
            listDom[i].classList.remove(className);
        }
        targetDom.classList.add(className);
    }
    /**
     * 绑定所有的事件
     */
    function bindEvent() {
        //左侧导航绑定事件
        menuBindEvent();
        //新增绑定事件
        addBindEvent();
        //删除绑定事件
        deleteBindEvent();
    }
    /**
     * 左侧菜单事件绑定
     */
    function menuBindEvent() {
        //获取左侧导航dom元素
        var menuList = document.querySelector('.menu-list');
        //左侧导航绑定事件
        menuList.addEventListener('click', function (e) {
            var tagName = e.target.tagName;
            //不符合条件直接return
            if (tagName !== "DD") {
                return;
            }
            //设置左侧菜单选中样式
            var oDD = document.querySelectorAll('dd');
            initStyle(oDD, 'active', e.target);

            //设置选中右侧显示内容
            var id = e.target.getAttribute('for');
            var rightContent = document.getElementById(id);
            var contentActive = document.querySelectorAll('.content-active');
            initStyle(contentActive, 'content-active', rightContent);
            if (id === "student-list") {
                getTableData();
            }
        }, false);
    }
    /**
     * 新增学生事件绑定
     */
    function addBindEvent() {
        var addStudentBtn = document.getElementById('add-student-btn');
        addStudentBtn.addEventListener('click', function (e) {
            e.preventDefault();
            //检验表单
            var studentAddForm = document.getElementById('student-add-form')
            var resultData = formatForm(studentAddForm);
            if (resultData.msg) {
                alert(resultData.msg);
                return;
            } else {
                transferData('/api/student/addStudent', resultData.data, function () {
                    alert('添加成功');
                    studentAddForm.reset();
                    studentListDom.click();
                })
            }
        })
    }

    /**
     * 删除学生 事件绑定
     */
    function deleteBindEvent(){
         var delBtn = document.querySelector('.delete');
         console.log(delBtn);
    }
    /**
     * 初始化启动
     */
    function init() {
        bindEvent();
        studentListDom.click();
    }
    init();
})()
/*
 * @Author: gexuerong 
 * @Date: 2019-09-30 13:42:05 
 * @Last Modified by: gexuerong
 * @Last Modified time: 2019-10-06 11:54:20
 */

/**
 * 学生管理系统js版
 */
(function () {

    var count = 0;
    //由查询条件返回的数据总数
    //保存表格数据
    var tableData = [];
    //当前页码
    var currentPage = 1;
    //每一页展示的条数
    var pageSize = 2;
    //性别 全部为-1 男为1 女为0
    var sex = -1;
    //查询条件
    var search = "";
    //默认的学生列表dom元素
    var studentListDom = document.querySelector('.menu-list').querySelectorAll('dd')[0];

    //编辑学生模态窗口
    var modal = document.querySelector('.modal');

    var page;
    //分页插件

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
            // appkey: 'ggbond521_1570005172207'
            appkey: 'qiqiqi_1569759019786'
            // appkey: 'sa0okm9ijn_1569813133048'
        }, data));
        if (response.status === 'success') {
            success(response);
        } else {
            window.myPlugin.message({ content: response.msg });
        }
    }

    /**
     * 渲染表格数据
     * @param {Array} data 待渲染的数据 
     */
    function renderTable(data) {
        var tBody = document.getElementById('table-body');
        var str = `<th colspan="8">No Data</th>`;
        if (data.length !== 0) {
            str = "";
        }
        data.forEach(function (item, index) {
            str += `<tr>
                        <td>${item.sNo}</td>
                        <td>${item.name}</td>
                        <td>${item.sex === 0 ? '男' : '女'}</td>
                        <td>${item.email}</td>
                        <td>${new Date().getFullYear() - item.birth}</td>
                        <td>${item.phone}</td>
                        <td>${item.address}</td>
                        <td>
                            <button class="btn edit" data-index='${index}' >编辑</button>
                            <button class="btn delete" data-index='${index}' >删除</button>
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
            tableData = data;
            count = res.data.cont;
        })
        InitPage(getTableData);
    }

    /**
     * 根据条件查询数据
     */
    function getTableDataByFilter() {
        transferData('/api/student/searchStudent', {
            sex: sex,
            search: search,
            page: currentPage,
            size: pageSize
        }, function (res) {
            var data = res.data.searchList;
            renderTable(data);
            tableData = data;
            count = res.data.cont;
        })
        InitPage(getTableDataByFilter);
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
        //表格中按钮绑定事件
        tBodyBtnBindEvent();
        //编辑的提交绑定事件
        editBindEvent();
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
                window.myPlugin.message({ content: resultData.msg });
                return;
            } else {
                transferData('/api/student/addStudent', resultData.data, function () {
                    window.myPlugin.message({ content: '添加成功' });
                    studentAddForm.reset();
                    studentListDom.click();
                })
            }
        })
    }
    /**
     * 编辑学生提交事件绑定
     */
    function editBindEvent() {
        var editSubmitBtn = document.getElementById('edit-student-btn');
        editSubmitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            var editForm = document.getElementById('edit-form');
            var resultData = formatForm(editForm);
            if (resultData.msg) {
                return false;
            } else {
                transferData('/api/student/updateStudent', resultData.data, function () {
                    window.myPlugin.message({ content: '修改成功' })
                    modal.style.display = 'none';
                    getTableData();
                })
            }
        });
    }
    /**
     * 表格中按钮点击事件
     */
    function tBodyBtnBindEvent() {
        var tableBody = document.querySelector('.student-list');
        tableBody.addEventListener('click', function (e) {
            var tagName = e.target.tagName;
            if (tagName !== 'BUTTON') {
                return;
            }
            var isEdit = [].slice.call(e.target.classList).indexOf('edit') !== -1;
            var isQuery = [].slice.call(e.target.classList).indexOf('query') !== -1;
            var isDelete = [].slice.call(e.target.classList).indexOf('delete') !== -1;
            var index = e.target.dataset.index;
            if (isEdit) {
                editStudent(index);
            } else if (isDelete) {
                window.myPlugin.openConfirm({
                    onconfirm: function () {
                        deleteStudent(index);
                    },
                    oncancel: function () {
                    }
                });
            } else if (isQuery) {
                sex = document.getElementById('sel-sex').selectedOptions[0].value;
                search = document.getElementById('sel-search').value;
                getTableDataByFilter();
            }
        }, false)
    }
    /**
     * 编辑学生弹窗
     * @param {Number} index 编辑学生的索引 
     */
    function editStudent(index) {
        modal.style.display = 'block';
        var editForm = document.getElementById('edit-form');
        var data = tableData[index];
        for (var prop in data) {
            if (editForm[prop]) {
                editForm[prop].value = data[prop];
            }
        }

    }
    /**
     * 删除学生
     * @param {Number} index 删除学生的索引 
     */
    function deleteStudent(index) {
        transferData('/api/student/delBySno', { sNo: tableData[index].sNo }, function () {
            window.myPlugin.message({ content: '已删除学生数据' })
            getTableData();
        });
    }



    /**
     * 初始化启动
     */
    function init() {
        bindEvent();
        studentListDom.click();
    }
    init();

    /**
     * 初始化分页
     */
    function InitPage(callBack) {
        if (!page) {
            page = new window.myPlugin.Pager({
                total: count,
                limit: pageSize,
                current: currentPage
            });
        }
        page.options.total = count;
        page.options.limit = pageSize;
        page.options.current = currentPage;
        page.options.onPageChange = function () {
            currentPage = page.options.current;
            pageSize = page.options.limit;
            callBack();
        }
        page.show();
    }
})()
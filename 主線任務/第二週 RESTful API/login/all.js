/** 定義 **/
const input_username = document.querySelector("#username");
const input_password = document.querySelector("#password");
const btn_login = document.querySelector("#btn-login");

const apiPath = "tomtom";
const apiUrl = "https://vue3-course-api.hexschool.io/";

/** 
 * 登入 
 */
const loginApp = {
    user :{
        username:"",
        password:"",
    },
    /** 清除表單內容 */
    clearFormData(){
        input_username.value = "";
        input_password.value = "";
    },
    /** 取得表單內容(帳號、密碼) */
    getFormData(){
        this.user.username = input_username.value;
        this.user.password = input_password.value
    },
    /** 檢查登入 */
    checkLogin(e){
        e.preventDefault();
        loginApp.getFormData();
        // console.log(loginApp.user);
        //登入API post
        axios.post(`${apiUrl}admin/signin`,loginApp.user)
        .then((res)=>{
            if(res.data.success){
                const {token , expired} = res.data;
                //token存入Cookie
                loginApp.accessCookie(token , expired);
                window.alert("登入成功!");
                //清空表單內容
                loginApp.clearFormData();
            }
        })
    },
    /** 存取Cookie */
    accessCookie(token,expired){
        document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
    },
    /** 註冊事件 */
    registerEvents(){
        btn_login.addEventListener("click",this.checkLogin);
    },
    init(){
        this.registerEvents();
    }
}

/**
 * 產品
 */
const product = {
    data:{
        products:[]
    },
    /** 取得產品列表 */
    getData(){
        axios.get(`${apiUrl}api/${apiPath}/admin/products`)
        .then(res=>{
            if(res.data.success){
                this.data.products = res.data.products;
                this.render();
            }
        })
    },
    /** 渲染網頁 */
    render(){
        const productList = document.querySelector("#productList");
        const productCount = document.querySelector("#productCount");
        let list = "";
        this.data.products.forEach((product)=>{
           list += `
            <tr>
                <td>${product.title}</td>
                <td width="120">
                  ${product.origin_price}
                </td>
                <td width="120">
                  ${product.price}
                </td>
                <td width="100">
                  <span class="">${(product.is_enabled == "1" ? "啟用" : "停用")}</span>
                </td>
                <td width="120">
                  <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove" data-id=""> 刪除 </button>
                </td>
              </tr>
            `;
        })

        productList.innerHTML = list;
        productCount.innerText = this.data.products.length;
    },
    init(){
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.getData();
    }
}

//初始化
loginApp.init();
product.init();
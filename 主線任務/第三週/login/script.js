/** 
 * 登入頁面
*/

const app = Vue.createApp({
    data(){
        return {
            apiUrl:"https://vue3-course-api.hexschool.io/",
            user:{
                username:"",
                password:""
            }
        }
    },
    methods:{
        /** 清除表單內容*/
        clearFormData(){
            this.user.username = "";
            this.user.password = "";
        },
        /** 檢查登入*/
        checkLogin(){
            if(this.user.username.trim() === "" || this.user.password.trim() === ""){
                window.alert("請輸入帳號及密碼!");
            }else{
                axios.post(`${this.apiUrl}admin/signin`,this.user)
                .then((res)=>{
                    // console.log(res);
                    if(res.data.success){
                        //解構出 token 與 expired
                        const {token , expired} = res.data;
                        //token存入Cookie
                        this.accessCookie(token , expired);
                        window.alert(res.data.message);
                        //清空表單內容
                        this.clearFormData();
                        //轉址到產品頁面
                        window.location = "../products/index.html";
                    }else{
                        window.alert(res.data.message);
                    }
                })
                .catch(err=>{
                    const errMsg = err.response.data.message;
                    console.log(errMsg);
                })
            }
        },
        /** 存取Cookie */
        accessCookie(token,expired){
            document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
        },
    }
});

//綁定 #app
app.mount("#app");
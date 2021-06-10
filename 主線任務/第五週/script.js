
import userProductModal from './productModal.js';

const app = Vue.createApp({
    data() {
        return {
            // api資訊
            apiInfo:{
                url:"https://vue3-course-api.hexschool.io/api",
                path:"tomtom"
            },
            //Loading物件
            loadingStatus:{
                loadingItem:''
            },
            //產品列表
            products:[],
            //prop => 產品
            product:[],
            //表單
            form:{
                user:{
                    email:"",
                    name:"",
                    tel:"",
                    address:""
                },
                message:""
            },
            //購物車列表
            cart:{}
        }
    },
    methods: {
        resetForm(){
            this.form = {
                user:{
                    email:"",
                    name:"",
                    tel:"",
                    address:""
                },
                message:""
            }
        },
        //取得產品列表
        getProducts(){
            const api = `${this.apiInfo.url}/${this.apiInfo.path}/products`;
            axios.get(api)
            .then(res=>{
                if(res.data.success){
                    this.products = res.data.products;
                }else{
                    alert(res.data.message)
                }
            })
            .catch(err=>{
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        //取得單一產品
        getSingalProduct(product){
            const api = `${this.apiInfo.url}/${this.apiInfo.path}/product/${product.id}`;
            axios.get(api)
            .then(res=>{
                if(res.data.success){
                    this.product = res.data.product;
                    this.$refs.userProductModal.openModal();
                }else{
                    alert(res.data.message)
                }
                this.loadingStatus.loadingItem = "";
            })
            .catch(err=>{
                this.loadingStatus.loadingItem = "";
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        //加入購物車
        addCart(id,qty = 1,isModalShow = false){
            this.loadingStatus.loadingItem = id;
            const cartItem = { 
                "product_id":id,
                qty
            }
            const api = `${this.apiInfo.url}/${this.apiInfo.path}/cart`;
            axios.post(api,{data:cartItem})
            .then(res=>{
                if(res.data.success){
                    this.getCart();
                }
                alert(res.data.message)
                //判斷是否為Modal加入
                if(isModalShow){
                    this.$refs.userProductModal.hideModal();
                }
                this.loadingStatus.loadingItem = "";
            })
            .catch(err=>{
                this.loadingStatus.loadingItem = "";
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        //取得購物車列表
        getCart(){
            const api = `${this.apiInfo.url}/${this.apiInfo.path}/cart`;
            axios.get(api)
            .then(res=>{
                if(res.data.success){
                    this.cart = res.data.data;
                }else{
                    this.cart = {};
                    alert(res.message)
                }
            })
            .catch(err=>{
                this.cart = {};
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        //更新購物車
        updateCart(item){
            this.loadingStatus.loadingItem = item.id;
            if(item.qty > 0){
                const cartItem = { 
                    "product_id":item.product.id,
                    qty:item.qty
                }
                const api = `${this.apiInfo.url}/${this.apiInfo.path}/cart/${item.id}`;
                axios.put(api,{data:cartItem})
                .then(res=>{
                    alert(res.data.message)
                    this.getCart();
                    this.loadingStatus.loadingItem = "";
                })
                .catch(err=>{
                    this.loadingStatus.loadingItem = "";
                    const errMsg = err.response.data.message;
                    console.log(errMsg);
                })
            }else{
                this.loadingStatus.loadingItem = "";
                alert("產品數量不得小於1 !!");
            }
        },
        //刪除購物車 (單一/全部)
        deleteCart(id){
            this.loadingStatus.loadingItem = id;
            let api = `${this.apiInfo.url}/${this.apiInfo.path}/carts`;
            if(id != "999"){
                api = `${this.apiInfo.url}/${this.apiInfo.path}/cart/${id}`;
            }
            
            axios.delete(api)
            .then(res=>{
                if(res.data.success){
                    this.getCart();
                    alert(res.data.message)
                }else{
                    alert(res.data.message)
                }
                this.loadingStatus.loadingItem = "";
            })
            .catch(err=>{
                this.loadingStatus.loadingItem = "";
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        //表單送出
        onSubmit() {
            //重新取得購物車列表
            this.getCart();
            //檢查購物車內是否有資料可送出
            if(Object.keys("carts").length){
                this.loadingStatus.loadingItem = "submit";
                const order = { 
                    data:{
                        user:this.form.user,
                        message:this.form.message
                    }
                }
                const api = `${this.apiInfo.url}/${this.apiInfo.path}/order`;
                axios.post(api,order)
                .then(res=>{
                    if(res.data.success){
                        this.getCart();
                        this.resetForm();
                    }
                    alert(res.data.message)
                    this.loadingStatus.loadingItem = "";
                })
                .catch(err=>{
                    this.loadingStatus.loadingItem = "";
                    const errMsg = err.response.data.message;
                    console.log(errMsg);
                })
            }
        },
        //開啟[查看更多] Modal
        openModal(product){
            this.loadingStatus.loadingItem = product.id;
            this.getSingalProduct(product);
            // this.product = product;
        },
        //自訂驗證 : 電話號碼
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        }
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
})

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.component("userProductModal",userProductModal);
app.mount("#app");
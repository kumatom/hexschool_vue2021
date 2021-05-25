/**
 * 產品頁面
 */

const app = Vue.createApp({
    data(){
        return {
            //api資訊
            apiInfo:{
                url:"https://vue3-course-api.hexschool.io/api",
                path:"tomtom"
            },
            //產品清單
            product:{
                data:[]
            },
            isNewProduct:false, //是否新增產品
            //新增產品
            newProduct:{
                imagesUrl:[],       //多圖新增連結 (參考範例)
            },
            //modal
            modal:{
                product: null,    //新增產品
                editProduct:null, //編輯產品
                delProduct:null   //刪除產品
            }
        }
    },
    methods:{
        /** 取得登入後的token */
        getToken(){
            // 取出 Token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
            axios.defaults.headers.common.Authorization = token;
        },
        /** 初始化產品清單 */
        initProduct(){
            this.newProduct = {
                imagesUrl:[]       //多圖新增連結 (參考範例)
            }
        },
        /** 取得產品清單 */
        getData(){
            axios.get(`${this.apiInfo.url}/${this.apiInfo.path}/admin/products`)
            .then(res=>{
                if(res.data.success){
                    this.product.data = res.data.products;
                }else{
                    window.alert(res.data.message);
                }
            })
            .catch(err=>{
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        /** 新增 / 編輯產品(參考範例) */
        UpInsertProduct(){
            let url = `${this.apiInfo.url}/${this.apiInfo.path}/admin/product`;
            let http = 'post';
            
            //判斷是否為[新增產品] 或 [編輯產品]
            if(!this.isNewProduct) {
                url = `${this.apiInfo.url}/${this.apiInfo.path}/admin/product/${this.newProduct.id}`;
                http = 'put'
            }

            axios[http](url,  { data: this.newProduct })
            .then((res) => {
                if(res.data.success) {
                    window.alert(res.data.message);
                    this.modal.product.hide();
                    this.initProduct();
                    this.getData();
                } else {
                    window.alert(res.data.message);
                }
            })
            .catch(err=>{
                // console.dir(err);
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        /** 刪除單一產品 */
        delProduct(){
            axios.delete(`${this.apiInfo.url}/${this.apiInfo.path}/admin/product/${this.newProduct.id}`)
            .then(res=>{
                window.alert(res.data.message);
                this.modal.delProduct.hide();
                this.initProduct();
                this.getData();
            })
            .catch(err=>{
                // console.dir(err);
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        /** 開啟Modal */
        openModal(modalType,product){
            switch(modalType){
                //新增
                case "new":
                   this.initProduct();
                   this.isNewProduct = true;
                   this.modal.product.show();
                   break;
                //編輯
                case "edit":
                    this.newProduct = {...product};
                    this.isNewProduct = false;
                    this.modal.product.show();
                    break;
                //刪除
                case "del":
                    this.newProduct = {...product};
                    this.modal.delProduct.show();
                    break;
                default :
                    break;
            }
        },
        /** 多圖新增(參考範例) */
        createImages(){
            this.newProduct.imagesUrl = [];
            this.newProduct.imagesUrl.push('');
        }
    },
    created(){
        //取得登入後的token
        this.getToken();
        //取得產品清單
        this.getData();
    },
    mounted(){
        //取得Modal
        this.modal.product = new bootstrap.Modal(document.querySelector("#productModal"), {
            keyborad:false
        });
        this.modal.delProduct = new bootstrap.Modal(document.querySelector("#delProductModal"), {
            keyborad:false
        });
    }
})

app.mount("#app");
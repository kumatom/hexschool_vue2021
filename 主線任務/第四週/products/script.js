/**
 * 產品頁面
 */
import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js";
import pagination from "./pagination.js"

let productModal = null;
let delProductModal = null;

const app = createApp({
    components:{
        pagination
    },
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
            //分頁物件
            pageObj:{} 
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
        getData(page = 1){
            axios.get(`${this.apiInfo.url}/${this.apiInfo.path}/admin/products?page=${page}`)
            .then(res=>{
                if(res.data.success){
                    this.product.data = res.data.products;  //取得產品
                    this.pageObj = res.data.pagination;    //取得分頁資訊
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
        upsertProduct(newProduct){
            let url = `${this.apiInfo.url}/${this.apiInfo.path}/admin/product`;
            let http = 'post';
            
            //判斷是否為[新增產品] 或 [編輯產品]
            if(!this.isNewProduct) {
                url = `${this.apiInfo.url}/${this.apiInfo.path}/admin/product/${newProduct.id}`;
                http = 'put'
            }

            axios[http](url,  { data: newProduct })
            .then((res) => {
                if(res.data.success) {
                    window.alert(res.data.message);
                    productModal.hide();
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
                delProductModal.hide();
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
                   productModal.show();
                   break;
                //編輯
                case "edit":
                    this.newProduct = {...product};
                    this.isNewProduct = false;
                    productModal.show();
                    break;
                //刪除
                case "del":
                    this.newProduct = {...product};
                    delProductModal.show();
                    break;
                default :
                    break;
            }
        },
        
    },
    created(){
        //取得登入後的token
        this.getToken();
        //取得產品清單
        this.getData();
    },
    mounted(){
        //取得Modal
        productModal = new bootstrap.Modal(document.querySelector("#productModal"), {
            keyborad:false
        });
        delProductModal = new bootstrap.Modal(document.querySelector("#delProductModal"), {
            keyborad:false
        });
    }
})

app.component("productModal",{
    props:["newProduct","isNewProduct"],
    template:`
        <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel" 
            aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                    <h5 id="productModalLabel" class="modal-title">
                        <span v-if="isNewProduct">新增產品</span>
                        <span v-else>編輯產品</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                        <div class="mb-1">
                            <div class="form-group">
                            <label for="imageUrl">主要圖片</label>
                            <input type="text" class="form-control"
                                    placeholder="請輸入圖片連結" v-model="newProduct.imageUrl">
                            </div>
                            <img class="img-fluid" :src="newProduct.imageUrl" alt="">
                        </div>
                        <div class="mb-1">多圖新增</div>
                        <div v-if="Array.isArray(newProduct.imagesUrl)">
                            <div class="mb-1" v-for="(image, key) in newProduct.imagesUrl" :key="key">
                            <div class="form-group">
                                <label for="imageUrl">圖片網址</label>
                                <input v-model="newProduct.imagesUrl[key]" type="text" class="form-control"
                                placeholder="請輸入圖片連結">
                            </div>
                            <img class="img-fluid" :src="image">
                            </div>
                            <!-- 附加條件:最多設置5筆圖片網址 -->
                            <div
                            v-if="!newProduct.imagesUrl.length || (newProduct.imagesUrl[newProduct.imagesUrl.length - 1] && newProduct.imagesUrl.length < 5)">
                            <button class="btn btn-outline-primary btn-sm d-block w-100"
                                @click="newProduct.imagesUrl.push('')">
                                新增圖片
                            </button>
                            </div>
                            <div v-else>
                            <button class="btn btn-outline-danger btn-sm d-block w-100" @click="newProduct.imagesUrl.pop()">
                                刪除圖片
                            </button>
                            </div>
                        </div>
                        <div v-else>
                            <button class="btn btn-outline-primary btn-sm d-block w-100"
                            @click="createImages">
                            新增圖片
                            </button>
                        </div>
                        </div>
                        <div class="col-sm-8">
                        <div class="form-group">
                            <label for="title">標題</label>
                            <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="newProduct.title">
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6">
                            <label for="category">分類</label>
                            <input id="category" type="text" class="form-control"
                                    placeholder="請輸入分類" v-model="newProduct.category">
                            </div>
                            <div class="form-group col-md-6">
                            <label for="price">單位</label>
                            <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="newProduct.unit">
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6">
                            <label for="origin_price">原價</label>
                            <input id="origin_price" type="number" min="0" class="form-control" 
                                    placeholder="請輸入原價" v-model.number="newProduct.origin_price">
                            </div>
                            <div class="form-group col-md-6">
                            <label for="price">售價</label>
                            <input id="price" type="number" min="0" class="form-control"
                                    placeholder="請輸入售價" v-model.number="newProduct.price">
                            </div>
                        </div>
                        <hr>

                        <div class="form-group">
                            <label for="description">產品描述</label>
                            <textarea id="description" type="text" class="form-control"
                                    placeholder="請輸入產品描述" v-model="newProduct.description">
                            </textarea>
                        </div>
                        <div class="form-group">
                            <label for="content">說明內容</label>
                            <textarea id="description" type="text" class="form-control"
                                    placeholder="請輸入說明內容" v-model="newProduct.content">
                            </textarea>
                        </div>
                        <div class="form-group">
                            <div class="form-check">
                            <input id="is_enabled" class="form-check-input" type="checkbox"
                                    :true-value="1" :false-value="0" v-model="newProduct.is_enabled">
                            <label class="form-check-label" for="is_enabled">是否啟用</label>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        取消
                    </button>
                    <button type="button" class="btn btn-primary" @click="$emit('upsert-product',newProduct)">
                        確認
                    </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        /** 多圖新增(參考範例) */
        createImages(){
            this.newProduct.imagesUrl = [];
            this.newProduct.imagesUrl.push('');
        }
    },
});

app.component("delProductModal",{

});

app.mount("#app");
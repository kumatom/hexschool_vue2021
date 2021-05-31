export default {
    props:["pageObj"],
    template:`
    <nav aria-label="Page navigation">
        <ul class="pagination">
            <li 
                :class = "{ 'disabled' : !pageObj.has_pre }"
                class="page-item">
                <a class="page-link" href="#" aria-label="Previous" @click="$emit('get-page',pageObj.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item"
                :class = "{ 'active' : page === pageObj.current_page }"
                v-for="page in pageObj.total_pages" :key="page">
                <a class="page-link" href="#"  @click="$emit('get-page',page)">{{ page }}</a>
            </li>
            <li 
                :class = "{ 'disabled' : !pageObj.has_next }"
                class="page-item">
                <a class="page-link" href="#" aria-label="Next" @click="$emit('get-page',pageObj.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
    `,
    created(){
        console.log(this.pageObj);
    }
}
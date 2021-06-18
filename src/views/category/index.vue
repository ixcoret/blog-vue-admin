<template>
  <div class="app-container">
    <!-- 监听get-data事件，新增分类后执行getData方法重新获取数据 -->
    <category-add @get-data="getData" />

    <category-list @get-data="getData" :table-data="tableData" />
  </div>
</template>

<script>
import { list } from '@/api/category'
import CategoryAdd from './category-add'
import CategoryList from './category-list'

export default {
  components: {
    CategoryList,
    CategoryAdd
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      list().then(res => {
        this.tableData = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>


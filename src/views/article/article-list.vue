<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button
        size="small"
        type="danger"
        :disabled="multipleSelection.length === 0"
        @click="deleteBatch">批量删除
      </el-button>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="write">写文章</el-button>
    </div>
    <el-table
      stripe
      border
      :data="articleList"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        align="center"
        label="标题"
        width="500"
        fixed>
      </el-table-column>
      <el-table-column
        prop="categoryName"
        align="center"
        label="分类"
        width="180">
      </el-table-column>
      <el-table-column
        prop="tagNameList"
        align="center"
        label="标签"
        width="300">
        <template slot-scope="scope">
          <el-tag
            v-for="item of scope.row.tagList"
            :key="item.id"
            style="margin: 2px;"
            size="small"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="views"
        align="center"
        label="浏览量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="发布时间"
        width="160">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"
        width="160">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        fixed="right"
        width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { list } from '@/api/article'

export default {
  name: 'ArticleList',
  data() {
    return {
      multipleSelection: [],
      articleList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.listArticles()
  },
  methods: {
    write() {
      this.$router.push({ path: '/article/write' })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    listArticles() {
      const condition = { pageNum: this.currentPage, pageSize: this.pageSize }
      list(condition).then(res => {
        this.articleList = res.data.resultList
        this.total = res.data.total
      })
    },
    deleteBatch() {
    },
    handleUpdate(data) {
    },
    handleDelete(data) {
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listArticles()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.listArticles()
    }
  }
}
</script>

<style scoped>
  .operation-container {
    margin-bottom: 20px;
  }
  .pagination {
    margin-top: 20px;
  }
</style>

<template>
  <div class="app-container">
    <div class="operation-container">
      <el-button
        size="small"
        type="danger"
        :disabled="articleIdList.length === 0"
        @click="updateArticleDelete(null)">批量删除
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
        width="600"
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
        width="280">
        <template slot-scope="scope">
          <el-tag
            v-for="item of scope.row.tagList"
            :key="item.id"
            style="margin: 2px;"
            size="small"
          >
            {{ item.tagName }}
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
        width="180">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        fixed="right"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editArticle(scope.row.id)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="updateArticleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.pageNum"
      :page-sizes="[5, 10, 15]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>
</template>

<script>
import { list, updateArticleDelete } from '@/api/article'

export default {
  name: 'ArticleList',
  data() {
    return {
      articleList: [],
      articleIdList: [],
      deleted: 0,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.listArticles()
  },
  methods: {
    write() {
      this.$router.push({ path: '/article/write' })
    },
    handleSelectionChange(articleList) {
      this.articleIdList = []  // 先置空
      articleList.forEach(item => {
        this.articleIdList.push(item.id)
      })
    },
    listArticles() {
      const condition = { pageNum: this.pagination.pageNum, pageSize: this.pagination.pageSize }
      list(condition).then(res => {
        this.articleList = res.data.list
        this.pagination.total = res.data.total
      })
    },
    editArticle(id) {
      this.$router.push({ path: '/article/write/' + id })
    },
    updateArticleDelete(id) {
      let param = {};
      if (id != null) {
        param.idList = [id]
      } else {
        param.idList = this.articleIdList
      }
      param.deleted = this.deleted === 0 ? 1 : 0
      this.$confirm('确定删除[' + param.idList.length + ']篇文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateArticleDelete(param).then(resp => {
          if (resp) {
            this.$message.success(resp.message)
            this.listArticles()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.listArticles()
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val
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

<template>
  <div class="app-container">
    <div class="operation-container">
      <div>
        <el-button
          size="small"
          type="danger"
          :disabled="multipleSelection.length === 0"
          @click="deleteBatch">批量删除
        </el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog(null)">新增</el-button>
      </div>
      <div>
        <el-input
          v-model="keywords"
          class="input"
          size="small"
          placeholder="请输入搜索关键字"
          @keydown.enter.native="search">
        </el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </div>
    </div>
    <el-table
      stripe
      border
      :data="tableData"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        align="center"
        label="分类名称">
      </el-table-column>
      <el-table-column
        prop="articleCount"
        align="center"
        label="文章数">
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="openDialog(scope.row)">编辑
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
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.pageNum"
      :page-sizes="[5, 10, 15]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%">
      <div class="dialog-title-container" slot="title" ref="categoryTitle" />
      <el-form :model="category" size="small" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="category.categoryName" style="width: 90%" @keydown.enter.native="saveOrUpdate"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="dialogVisible = false">取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveOrUpdate">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteBatch, deleteById, listCategories, update, save } from '@/api/category'

export default {
  name: 'Category',
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      keywords: '',
      category: {
        id: null,
        categoryName: ''
      },
      dialogVisible: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.listCategories()
  },
  methods: {
    listCategories() {
      const condition = { pageNum: this.pagination.pageNum, pageSize: this.pagination.pageSize }
      listCategories(condition).then(res => {
        this.tableData = res.data.list
        this.pagination.total = res.data.total
      })
    },
    openDialog(category) {
      if (category != null) {
        this.category.id = category.id
        this.category.categoryName = category.categoryName
        this.$refs.categoryTitle.innerHTML = "修改分类";
      } else {
        this.category.id = null;
        this.category.categoryName = "";
        this.$refs.categoryTitle.innerHTML = "添加分类";
      }
      this.dialogVisible = true;
    },
    saveOrUpdate() {
      // 去除字符串两端空格字符
      this.category.categoryName = this.category.categoryName.trim()
      if (this.category.categoryName === '') {
        this.$message.error('分类名不能为空！')
        return false
      }
      if (this.category.id === null) {
        save(this.category).then(resp => {
          if (resp) {
            this.dialogVisible = false
            this.$message.success(resp.message)
            this.listCategories()
          }
        })
      } else {
        update(this.category).then(resp => {
          if (resp) {
            this.dialogVisible = false
            this.$message.success(resp.message)
            this.listCategories()
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(category) {
      this.$confirm('确定删除[' + category.categoryName + ']分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(category.id).then(resp => {
          this.listCategories()
          this.$message.success(resp.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteBatch() {
      this.$confirm('确定删除[' + this.multipleSelection.length + ']条分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let ids = '?'
        const ids = []
        this.multipleSelection.forEach(item => {
          ids.push(item.id)
          // ids += 'ids=' + item.id + '&'
        })
        console.log(ids)
        deleteBatch(ids).then(resp => {
          if (resp) {
            this.$message.success(resp.message)
            this.listCategories()
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
      this.listCategories()
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val
      this.listCategories()
    },
    search() {
    }
  }
}
</script>

<style scoped>
.operation-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.input {
  width: 300px;
  margin-right: 10px;
}

.pagination {
  margin-top: 20px;
}
</style>

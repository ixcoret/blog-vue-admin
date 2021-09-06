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
      </div>
      <div>
        <el-input
          v-model="category.name"
          class="input"
          size="small"
          placeholder="请输入分类名称"
          @keydown.enter.native="add">
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="add">新增</el-button>
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
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
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
    <el-dialog
      title="编辑分类"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="category" size="small" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" style="width: 90%" @keydown.enter.native="doUpdate"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="dialogVisible = false">取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="doUpdate">确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteBatch, deleteById, list, update, save } from '@/api/category'

export default {
  name: 'Category',
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      keywords: '',
      category: {
        name: ''
      },
      dialogVisible: false
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
    },
    add() {
      // 去除字符串两端空格字符
      this.category.name = this.category.name.trim()
      if (this.category.name) {
        save(this.category).then(res => {
          this.category.name = ''
          this.getData()
          this.$message.success(res.message)
        })
      } else {
        this.$message.error('分类名称不能为空！')
      }
    },
    search() {
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(data) {
      this.$confirm('确定删除[' + data.name + ']分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(data.id).then(resp => {
          this.getData()
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
            this.getData()
            this.$message.success(resp.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUpdate(data) {
      Object.assign(this.category, data)
      this.dialogVisible = true
    },
    doUpdate() {
      update(this.category).then(resp => {
        if (resp) {
          this.dialogVisible = false
          this.getData()
          this.$message.success(resp.message)
        }
      })
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
</style>


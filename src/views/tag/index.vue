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
          v-model="tag.name"
          class="input"
          size="small"
          placeholder="请输入标签名称"
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
      :default-sort = "{prop: 'createTime', order: 'descending'}"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="标签名称">
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
    <el-dialog
      title="编辑标签"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="tag" size="small" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="tag.name" style="width: 90%" @keydown.enter.native="doUpdate"/>
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
import { deleteBatch, deleteById, listTags, update, save } from '@/api/tag'

export default {
  name: 'Tag',
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      keywords: '',
      tag: {
        name: ''
      },
      dialogVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.listTags()
  },
  methods: {
    listTags() {
      const condition = { pageNum: this.currentPage, pageSize: this.pageSize }
      listTags(condition).then(res => {
        this.tableData = res.data.resultList
        this.total = res.data.total
      })
    },
    add() {
      // 去除字符串两端空格字符
      this.tag.name = this.tag.name.trim()
      if (this.tag.name) {
        save(this.tag).then(res => {
          this.tag.name = ''
          this.listTags()
          this.$message.success(res.message)
        })
      } else {
        this.$message.error('标签名称不能为空！')
      }
    },
    search() {
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(data) {
      this.$confirm('确定删除[' + data.name + ']标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(data.id).then(resp => {
          this.listTags()
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
      this.$confirm('确定删除[' + this.multipleSelection.length + ']条标签?', '提示', {
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
            this.listTags()
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
      Object.assign(this.tag, data)
      this.dialogVisible = true
    },
    doUpdate() {
      update(this.tag).then(resp => {
        if (resp) {
          this.dialogVisible = false
          this.$message.success(resp.message)
          this.listTags()
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listTags()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.listTags()
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

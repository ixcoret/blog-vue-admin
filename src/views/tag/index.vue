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
      :default-sort = "{prop: 'createTime', order: 'descending'}"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tagName"
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
      <div class="dialog-title-container" slot="title" ref="tagTitle" />
      <el-form :model="tag" size="small" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="tag.tagName" style="width: 90%" @keydown.enter.native="saveOrUpdate"/>
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
import { deleteBatch, deleteById, listTags, update, save } from '@/api/tag'

export default {
  name: 'Tag',
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      keywords: '',
      tag: {
        id: null,
        tagName: ''
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
    this.listTags()
  },
  methods: {
    listTags() {
      const condition = { pageNum: this.pagination.pageNum, pageSize: this.pagination.pageSize }
      listTags(condition).then(res => {
        this.tableData = res.data.list
        this.pagination.total = res.data.total
      })
    },
    openDialog(tag) {
      if (tag != null) {
        this.tag.id = tag.id
        this.tag.tagName = tag.tagName
        this.$refs.tagTitle.innerHTML = '修改标签'
      } else {
        this.tag.id = null
        this.tag.tagName = ''
        this.$refs.tagTitle.innerHTML = '添加标签'
      }
      this.dialogVisible = true
    },
    saveOrUpdate() {
      // 去除字符串两端空格字符
      this.tag.tagName = this.tag.tagName.trim()
      if (this.tag.tagName.trim() === '') {
        this.$message.error('分类名不能为空！')
        return false
      }
      if (this.tag.id === null) {
        save(this.tag).then(resp => {
          if (resp) {
            this.dialogVisible = false
            this.$message.success(resp.message)
            this.listTags()
          }
        })
      } else {
        update(this.tag).then(resp => {
          if (resp) {
            this.dialogVisible = false
            this.$message.success(resp.message)
            this.listTags()
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(tag) {
      this.$confirm('确定删除[' + tag.tagName + ']标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(tag.id).then(resp => {
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
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.listTags()
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val
      this.listTags()
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

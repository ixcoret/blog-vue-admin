<template>
  <div>
    <el-table
      max-height="500"
      stripe
      border
      size="small"
      style="width: 90%"
      :data="tableData"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="分类名称"
        width="330">
      </el-table-column>
      <el-table-column
        prop="blogCount"
        align="center"
        label="博客数"
        width="200">
      </el-table-column>
      <el-table-column
        prop="enabled"
        align="center"
        label="是否启用"
        width="250">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.enabled === true" type="success">已启用</el-tag>
          <el-tag size="small" v-else type="info">未启用</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        min-width="200">
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
    <el-button
      size="small"
      style="margin: 10px 20px"
      type="danger"
      :disabled="this.multipleSelection.length === 0"
      @click="deleteMany">批量删除
    </el-button>

    <el-dialog
      title="编辑分类"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="category" size="small" label-width="80px">
        <el-form-item label="分类名称">
          <el-input style="width: 90%" v-model="category.name" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="category.enabled"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
      </el-form>

      <span
        class="dialog-footer"
        slot="footer">
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
import { deleteById } from '@/api/category'
import { deleteMany } from '@/api/category'
import { update } from '@/api/category'
export default {
  name: 'CategoryList',
  data() {
    return {
      multipleSelection: [],
      category: {
        name: '',
        enabled: false
      },
      dialogVisible: false
    }
  },
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
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
          this.$emit('get-data')
          this.$message.success(resp.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteMany() {
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
        deleteMany(ids).then(resp => {
          if (resp) {
            this.$emit('get-data')
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
          this.$emit('get-data')
          this.dialogVisible = false
          this.$message.success(resp.message)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

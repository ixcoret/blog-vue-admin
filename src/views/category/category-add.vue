<template>
  <div class="card">
    <el-form :inline="true" :model="category">
      <el-form-item label="分类名称">
        <el-input
          v-model="category.name"
          class="category-input"
          size="small"
          placeholder="请输入分类名称"
          suffix-icon="el-icon-plus"
          @keydown.enter.native="add">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { save } from '@/api/category'
export default {
  name: 'CategoryAdd',
  data() {
    return {
      category: {
        name: ''
      }
    }
  },
  methods: {
    add() {
      // 去除字符串两端空格字符
      this.category.name = this.category.name.trim()
      if (this.category.name) {
        save(this.category).then(res => {
          // 触发自定义的get-data事件，父组件监听该事件调用getData方法
          this.$emit('get-data')
          this.category.name = ''
          this.$message.success(res.message)
        })
      } else {
        this.$message.error('分类名称不能为空！')
      }
    }
  }
}
</script>

<style scoped>
  .category-input {
    width: 300px;
    margin-right: 15px;
  }
  .card {
    margin-bottom: 20px;
    display: inline-block;
    padding: 22px 12px 0 22px;
    border-width: 2px;
    border-color: #ebeef5;
    border-style: solid;
  }
</style>

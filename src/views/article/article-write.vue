<template>
  <div class="app-container">
    <el-form ref="articleForm" size="small" :model="articleForm" :rules="articleRules" hide-required-asterisk label-width="42px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="articleForm.title" size="medium" type="text" minlength="4" maxlength="100" show-word-limit placeholder="请输入文章标题" />
      </el-form-item>

      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-form-item label="分类">
            <!--单选时，v-model的值为当前被选中的el-option的 value 属性值-->
            <el-select
              v-model="bindCategory"
              style="width: 100%"
              size="medium"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder="选择已有分类或添加新分类">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id + ':' + category.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="标签">
            <el-select
              v-model="bindTags"
              style="width: 100%"
              size="medium"
              filterable
              multiple
              :multiple-limit="4"
              allow-create
              default-first-option
              value-key="id"
              clearable
              placeholder="选择已有标签或添加新标签，最多4个">
              <el-option
                v-for="tag in tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id + ':' + tag.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="正文">
        <mavon-editor v-model="articleForm.content" :style="editorHeight" @fullScreen="fullScreen"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="publish()">发布文章</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { list } from '@/api/category'
import { listTagOptions } from '@/api/tag'
import { save } from '@/api/article'

import { ME_HEIGHT, ME_FULLSCREEN_HEIGHT } from '@/constant/mavonEditorHeight'

export default {
  name: 'ArticleWrite',
  components: {
    mavonEditor
  },
  data() {
    return {
      editorHeight: ME_HEIGHT,
      articleForm: {
        title: '',
        categoryForm: {},
        tags: [],
        content: ''
      },
      bindCategory: '',
      bindTags: [],
      categories: [],
      tags: [],
      articleRules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCategories()
    this.listTagOptions()
  },
  methods: {
    fullScreen(status) {
      this.editorHeight = status ? ME_FULLSCREEN_HEIGHT : ME_HEIGHT
    },
    getCategories() {
      list().then(res => {
        this.categories = res.data
      })
    },
    listTagOptions() {
      listTagOptions().then(res => {
        this.tags = res.data
      })
    },
    // 将选择的以及新创建的所有标签重建为标签对象
    rebuildSeletedTags() {
      const tagArr = []
      this.bindTags.forEach(e => {
        const propArr = e.split(':')
        // 已存在的标签
        if (propArr.length === 2) {
          tagArr.push({ id: propArr[0], name: propArr[1] })
        }
        // 新增的标签
        if (propArr.length === 1) {
          tagArr.push({ name: propArr[0] })
        }
      })
      this.articleForm.tags = tagArr
    },
    // 将选择的或新创建的分类重建为分类对象
    rebuildSelectedCategory() {
      const propArr = this.bindCategory.split(':')
      // 已存在的标签
      if (propArr.length === 2) {
        this.articleForm.categoryForm = { id: propArr[0], name: propArr[1] }
      }
      // 新增的标签
      if (propArr.length === 1) {
        this.articleForm.categoryForm = { name: propArr[0] }
      }
    },
    // 发布文章
    publish() {
      this.$refs.articleForm.validate(valid => {
        if (valid) {
          this.rebuildSelectedCategory()
          this.rebuildSeletedTags()
          save(this.articleForm).then(res => {
            this.$message.success(res.message)
          })
          this.getCategories()
          this.listTagOptions()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    // TODO：增加保存草稿功能
  }
}
</script>
<style scoped>
</style>

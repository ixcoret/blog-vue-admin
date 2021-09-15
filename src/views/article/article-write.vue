<template>
  <div class="app-container">
    <el-form ref="article" size="small" :model="article" :rules="articleRules" hide-required-asterisk label-width="42px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="article.title" type="text" minlength="5" maxlength="100" show-word-limit placeholder="请输入文章标题" />
      </el-form-item>

      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <el-form-item label="分类">
            <!--单选时，v-model的值为当前被选中的el-option的 value 属性值-->
            <el-select
              v-model="article.categoryName"
              style="width: 100%"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder="选择已有分类或添加新分类">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.categoryName"
                :value="item.categoryName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="17">
          <el-form-item label="标签">
            <!-- 文章标签 -->
            <el-tag
              v-for="(item, index) of article.tagNameList"
              :key="index"
              style="margin:0 10px 0 0"
              closable
              @close="removeTag(item)"
            >
              {{ item }}
            </el-tag>
            <!-- 标签选项 -->
            <el-popover
              placement="bottom-start"
              width="600"
              trigger="click"
              v-if="article.tagNameList.length < 4">
              <div style="margin-bottom: 10px">创建标签</div>
              <el-autocomplete
                style="width:80%"
                v-model="tagName"
                :fetch-suggestions="searchTags"
                placeholder="输入标签名搜索，按enter键可添加自定义标签"
                :trigger-on-focus="false"
                @keyup.enter.native="saveTag"
                @select="handleSelectTag"
              >
                <template slot-scope="{ item }">
                  <div>{{ item.tagName }}</div>
                </template>
              </el-autocomplete>
              <div style="margin: 20px 0 10px">选择标签</div>
              <!-- 标签 -->
              <div class="popover-container">
                <el-tag
                  v-for="(item, index) of tagList"
                  :key="index"
                  style="margin: 5px"
                  :class="tagClass(item)"
                  @click="addTag(item)"
                >
                  {{ item.tagName }}
                </el-tag>
              </div>
              <el-button slot="reference">添加标签</el-button>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="正文">
        <mavon-editor v-model="article.content" :style="editorHeight" @fullScreen="fullScreen" />
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
import { listCategoryOptions } from '@/api/category'
import { listTagOptions } from '@/api/tag'
import { save, getById } from '@/api/article'

import { ME_HEIGHT, ME_FULLSCREEN_HEIGHT } from '@/constant/mavonEditorHeight'

export default {
  name: 'ArticleWrite',
  components: {
    mavonEditor
  },
  data() {
    return {
      editorHeight: ME_HEIGHT,
      categoryList: [],
      tagList: [],
      article: {
        title: '',
        categoryName: null,
        tagNameList: [],
        content: ''
      },
      tagName: '',
      articleRules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }]
      }
    }
  },
  created() {
    const path = this.$route.path
    const arr = path.split('/')
    const articleId = arr[3]
    if (articleId) {
      getById(articleId).then(resp => {
        if (resp) {
          this.article = resp.data
        }
      })
    }
    this.listCategoryOptions()
    this.listTagOptions()
  },
  computed: {
    tagClass() {
      return function(item) {
        const index = this.article.tagNameList.indexOf(item.tagName)
        return index !== -1 ? 'tag-item-select' : 'tag-item'
      }
    }
  },
  methods: {
    fullScreen(status) {
      this.editorHeight = status ? ME_FULLSCREEN_HEIGHT : ME_HEIGHT
    },
    listCategoryOptions() {
      listCategoryOptions().then(res => {
        this.categoryList = res.data
      })
    },
    listTagOptions() {
      listTagOptions().then(res => {
        this.tagList = res.data
      })
    },
    searchTags(queryString, cb) {
      var tagList = this.tagList
      var results = queryString ? tagList.filter(this.createFilter(queryString)) : tagList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (tag) => {
        return (tag.tagName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelectTag(item) {
      this.addTag({
        tagName: item.tagName
      })
    },
    saveTag() {
      if (this.tagName.trim() !== '') {
        this.addTag({
          tagName: this.tagName
        })
        this.tagName = ''
      }
    },
    addTag(item) {
      if (this.article.tagNameList.indexOf(item.tagName) === -1) {
        this.article.tagNameList.push(item.tagName)
      }
    },
    removeTag(item) {
      const index = this.article.tagNameList.indexOf(item)
      this.article.tagNameList.splice(index, 1)
    },
    // 发布文章
    publish() {
      this.$refs.article.validate(valid => {
        console.log(this.article)
        if (valid) {
          save(this.article).then(res => {
            this.$message.success(res.message)
            this.$router.push({ path: '/article/list' })
          })
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
  .tag-item {
    cursor: pointer;
  }
  .tag-item-select {
    cursor: not-allowed;
    color: #cccccc !important;
  }
</style>

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: {
      title: '文章管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/article/article-list'),
        name: 'List',
        meta: { title: '文章列表' }
      },
      {
        path: 'write',
        component: () => import('@/views/article/article-write'),
        name: 'Write',
        meta: { title: '发布文章' }
      },
      {
        path: 'write/:id',
        component: () => import('@/views/article/article-write'),
        name: 'Edit'
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category'),
        meta: { title: '文章分类' }
      },
      {
        path: 'tag',
        name: 'Tag',
        component: () => import('@/views/tag'),
        meta: { title: '文章标签' }
      }
    ]
  },
  {
    path: '/website',
    component: Layout,
    redirect: '/website/info',
    name: 'Website',
    meta: {
      title: '网站管理',
      icon: 'form'
    },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/website/info'),
        meta: { title: '网站信息' }
      },
      {
        path: 'link',
        name: 'Link',
        component: () => import('@/views/website/friend-link'),
        meta: { title: '友链管理' }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Log',
        component: () => import('@/views/log'),
        meta: { title: '系统日志', icon: 'el-icon-link' }
      }
    ]
  },
  {
    path: '/personal',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Personal',
        component: () => import('@/views/personal'),
        meta: { title: '个人中心', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

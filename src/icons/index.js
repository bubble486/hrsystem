import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
// 全局注册组件
Vue.component('svg-icon', SvgIcon)

// require.context(目标目录，是否扫描子目录，正则表达式) 扫描目录中的文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

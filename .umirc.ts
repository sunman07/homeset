import { defineConfig } from 'umi';
//cdn地址
const cdnBaseHttp = 'https://h5public.xiaoyuanjijiehao.com/';
const token = 'DQD2RR7BMAADV089LY_GQA';
export default defineConfig({
  publicPath: './',
  routes: [
    // { path: '/', component: '@/pages/index' }
    // { path: '/', component: '@/pages/in_AccomAmodation_student/InAccomAmodationStudent' },
    {
      path: '/',
      component: '@/pages/standardconfig/index',
    },
  ],
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  devServer: {
    port: 8082,
  },
  proxy: {
    '/h5api': {
      target: 'https://dev.xiaoyuanjijiehao.com:10010/',
      //标准配置
      //target :'https://192.168.175.6:10092/',
      //target: "http://192.168.175.125:999",
      //target: 'https://h5apitest.xiaoyuanjijiehao.com:9999/',
      //target: 'http://127.0.0.1:9085',
      changeOrigin: true,
      pathRewrite: {
        '^/api': 'api',
      },
      onProxyReq: (proxyReq: {
        setHeader: (arg0: string, arg1: string) => void;
      }) => {
        //更改token请求
        // proxyReq.setHeader('AccessToken', token);
        proxyReq.setHeader('AccessToken', token);
        //const 为了注释而注释 = 1;
        proxyReq.setHeader('cache-control', 'no-cache');
        proxyReq.setHeader('user-agent', 'vscode-restclient');
      },
    },
  },
  hash: true,
  history: { type: 'hash' },
  /* 自定义antd theme */
  theme: {
    '@card-head-padding': '6px',
    '@card-head-height': '24',
    '@border-radius-base': '4px',
  },
  externals: {
    moment: 'moment',
    axios: 'axios',
  },
  scripts: [
    `${cdnBaseHttp}moment/moment.min.js`,
    `${cdnBaseHttp}vue/axios.min.js`,
  ],
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    // 删除 umi 内置插件
    memo.plugins.delete('progress');
    memo.plugins.delete('friendly-error');
  },
});

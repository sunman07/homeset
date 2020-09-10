import axios from 'axios';

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    console.debug('发出请求');
    // config.headers.AccessToken = window["__AppWebkey"];
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    console.error('出错了');
    return Promise.reject(error);
  },
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    console.log(error);
    const res = error.response.data;
    console.log(`status:${res.status}->${res.text}`);
    if (error.response.status != '401') {
      return Promise.reject(error);
    } else {
      return Promise.resolve(error.response);
    }
  },
);
export default axios;

import axios from '@/lib/fetch';
import { stringify } from 'qs';
const baseUrl = '/apartment';
const baseLink = '/secondclassroom';

//获取主列表
export const getMainEntry = params => {
  return axios
    .get(
      baseLink +
        `/api/v1/scoreapprove/queryscoreapprove?ApprovalStatus=${
          params.ApprovalStatus
        }&Page=${params.Page}&PageCount=${
          params.PageCount
        }&ClassCode=${params.ClassCode ||
          ''}&StuUserCode=${params.StuUserCode ||
          ''}&StuName=${params.StuName || ''}&ModuleCode=${params.ModuleCode ||
          ''}&ItemCode=${params.ItemCode ||
          ''}&StandardCode=${params.StandardCode || ''}`,
    )
    .then(res => {
      return res;
    });
};
//获取责任班级
export const getMangerClass = () => {
  return axios.get(`/core/api/v1/user/staffroledept?RoleGroup=3`).then(res => {
    return res;
  });
};
//审批成绩
export const getApproveScore = params => {
  return axios
    .post(baseLink + `/api/v1/scoreapprove/approvescore`, params)
    .then(res => {
      return res;
    });
};
// 获取年级
export const getGrade = query => {
  return axios.get(baseUrl + `/api/v2/grade?${stringify(query)}`).then(res => {
    return res;
  });
};
// 获取标准列表
export const getConfigEntry = params => {
  return axios
    .post(baseLink + `/api/v1/standard/querystandard`, params)
    .then(res => {
      return res;
    });
};
// 获取模块字典
export const getModuleDic = () => {
  return axios.get(`/core/api/v1/bizcode?code_type=secondclass`).then(res => {
    return res;
  });
};
//获取项目字典
export const getObjectDic = params => {
  return axios
    .get(baseLink + `/api/v1/standard/queryitemnopag?ModuleCode=${params}`)
    .then(res => {
      return res;
    });
};
//获取标准字典
export const getStandardsDic = params => {
  return axios
    .get(baseLink + `/api/v1/standard/querystandardnopag?ItemCode=${params}`)
    .then(res => {
      return res;
    });
};
//学分兑换查询模块
export const getScoreForModule = params => {
  return axios
    .post(baseLink + `/api/v1/standard/querymodule`, params)
    .then(res => {
      return res;
    });
};

//提交学分兑换
export const toSubmitModule = params => {
  return axios
    .post(baseLink + `/api/v1/standard/setscoreconvert`, params)
    .then(res => {
      return res;
    });
};

//查询学分兑换
export const getModuleForExchange = () => {
  return axios
    .get(baseLink + `/api/v1/standard/queryscoreconvert`)
    .then(res => {
      return res;
    });
};
//删除学分兑换
export const delModuleOfExchange = params => {
  return axios
    .post(baseLink + `/api/v1/standard/delscoreconvert`, params)
    .then(res => {
      return res;
    });
};
//查询项目
export const getProjectItem = params => {
  return axios
    .post(baseLink + `/api/v1/standard/queryitem`, params)
    .then(res => {
      return res;
    });
};

//添加项目
export const addObjectItem = params => {
  return axios.post(baseLink + `/api/v1/standard/additem`, params).then(res => {
    return res;
  });
};

//修改项目
export const editsObjectItem = params => {
  return axios
    .post(baseLink + `/api/v1/standard/edititem`, params)
    .then(res => {
      return res;
    });
};
//删除项目
export const removeObjectItem = params => {
  return axios.post(baseLink + `/api/v1/standard/delitem`, params).then(res => {
    return res;
  });
};
//修改模块
export const editsModuleItem = params => {
  return axios
    .post(baseLink + `/api/v1/standard/editmodule`, params)
    .then(res => {
      return res;
    });
};
//新增模块
export const addModuleItem = params => {
  return axios
    .post(baseLink + `/api/v1/standard/addmodule`, params)
    .then(res => {
      return res;
    });
};

//删除模块
export const removeModuleItem = params => {
  return axios
    .post(baseLink + `/api/v1/standard/delmodule`, params)
    .then(res => {
      return res;
    });
};
//添加标准
export const addStandardItem = params => {
  return axios
    .post(baseLink + `/api/v1/standard/addstandard`, params)
    .then(res => {
      return res;
    });
};
//编辑标注
export const editsStandardItem = params => {
  return axios
    .post(baseLink + `/api/v1/standard/editstandard`, params)
    .then(res => {
      return res;
    });
};

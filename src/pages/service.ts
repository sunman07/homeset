import http from '../lib/mock';
//import http from '../lib/fetch';

const api = '/api/classspace/';

export function getMyClassList(params = {}) {
  return http.postJSON({
    Router: `/api/classspace/getmyclasslist`,
    Method: 'POST',
    Body: params,
  });
}

export function GetSelectList(params = {}) {
  return http.postJSON({
    Router: `/api/classzone/querycounselorclass`,
    Method: 'POST',
    Body: params,
  });
}

export function getBizCode(code = '') {
  return http
    .postJSON({
      Router: `/api/classinfo/parameterinit`,
      Method: 'POST',
      Body: { parameter: [code] },
    })
    .then((r:any) => {
      const res = r.data;
      if (!res?.FeedbackCode) {
        return res.Data;
      }
    });
}

export function getClassDetail(params = {}) {
  return http.postJSON({
    Router: `${api}getclassspacestatistics`,
    Method: 'POST',
    Body: params,
  });
}
export function updateStudentType(params = {}) {
  return http.postJSON({
    Router: `${api}/updateallstudentmsg`,
    Method: 'POST',
    Body: params,
  });
}
export function classDetailExport(params = {}) {
  return http.postJSON({
    Router: `${api}/getclassspaceexport`,
    Method: 'POST',
    Body: params,
  });
}
/* 修改学生基本信息 */
export function updateUserInfo(params = {}) {
  return http.postJSON({
    Router: `${api}/updatestudentmsg`,
    Method: 'POST',
    Body: params,
  });
}
/* 获取专业 */
export function getMajors(code = '') {
  return http
    .postJSON({
      Router: `/api/classinfo/majorcascadeinit`,
      Method: 'POST',
      Body: { Academy: code },
    })
    .then((r: any) => {
      const res = r?.data;
      if (!res?.FeedbackCode) {
        return res.Data;
      }
    });
}
/* 获取年级 */
export function getGrades(params = {}) {
  return http
    .postJSON({
      Router: `/api/classinfo/gradecascadeinit`,
      Method: 'POST',
      Body: params,
    })
    .then((r: any) => {
      const res = r?.data;
      if (!res?.FeedbackCode) {
        return res.Data;
      }
    });
}
/* 获取学院班级 */
export function getAcademyClass(params = {}) {
  return http
    .postJSON({
      Router: `${api}getacademyclasslist`,
      Method: 'POST',
      Body: params,
    })
    .then((r: any) => {
      const res = r?.data;
      if (!res?.FeedbackCode) {
        return res.Data;
      }
    });
}
/* 认领班级 */
export function claimClass(params = {}) {
  return http.postJSON({
    Router: `${api}obtainclassqualification`,
    Method: 'POST',
    Body: params,
  });
}
/* 认领班级 */
export function unclaimClass(ClassCode = '') {
  return http.postJSON({
    Router: `${api}obtainclassqualification`,
    Method: 'POST',
    Body: { ClassCode, Type: '4' },
  });
}
/* 班级图表 */
export function getClass(ClassCode = '') {
  return http.postJSON({
    Router: `${api}getclassspacedetail`,
    Method: 'POST',
    Body: {  },
  });
}

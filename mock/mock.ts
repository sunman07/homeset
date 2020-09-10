import Mock from 'mockjs';

export default {
    'POST /api/classspace/getmyclasslist': Mock.mock({
    Data: {
      total: 55,
      [`list|20`]: [{
        classname: '@cname',
        classcode: '@guid',
        "gradname|1": ["2019","2018","2017"],
        instructor: '@cname',
        headmaster: '@cname',
        'studentnumber|+1': 1,
        classcommitteelist: { //班委列表
          'total': 2,
          'list|2': [
            {
              'position': '@cname',
              'name': '@cname',
            },
          ],
        },
        classalbum: { //班级相册
          'total': 20,
          'uploadnum': 50,
          'list|20': [
            {
              'photo': Mock.Random.image('200x100', '#FF6600'),
              'name': '@cname',
              'studentid': '',
            },
          ],
        },
      }],
    },
    FeedbackCode:0
  }),
  'POST /api/classspace/getclassspacestatistics': Mock.mock({
    Data: {
      total: 55,
      [`list|20`]: [{
        studentname: '@cname',
        usercode: '@guid',
        "sex|1": ["男","女"],
        "gradname|1": ["2019","2018","2017"],
        phone: '@cname',
        politicalaffiliation: '@cname',
        nation: '@cname',
        starttime: '@cname',
        'studentnumber|+1': 1
      }],
    },
    FeedbackCode:0
  }),
};

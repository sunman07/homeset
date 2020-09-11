import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Descriptions, Badge } from 'antd';
const DetailsSubUnit = props => {
  const { infoDetails } = props;
  return (
    <Fragment>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="学号">
          {infoDetails.StuUserCode}
        </Descriptions.Item>
        <Descriptions.Item label="姓名">
          {infoDetails.StuName}
        </Descriptions.Item>
        <Descriptions.Item label="班级">
          {infoDetails.ClassName}
        </Descriptions.Item>
        <Descriptions.Item label="分值">{infoDetails.Score}</Descriptions.Item>
        <Descriptions.Item label="所属模块">
          {infoDetails.ModuleName}
        </Descriptions.Item>
        <Descriptions.Item label="所属项目">
          {infoDetails.ItemName}
        </Descriptions.Item>
        <Descriptions.Item label="所属标准">
          {infoDetails.StandardName}
        </Descriptions.Item>
        <Descriptions.Item label="参与时间">
          {infoDetails.ParticipateDate}
        </Descriptions.Item>
        <Descriptions.Item label="证明材料" span={2}>
          {infoDetails.Evidence}
        </Descriptions.Item>
        <Descriptions.Item label="详细描述" span={2}>
          {infoDetails.Description}
        </Descriptions.Item>
      </Descriptions>
    </Fragment>
  );
};

export default DetailsSubUnit;

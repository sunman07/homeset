import React from 'react';
import { Card, Avatar } from 'antd';
import styles from './Header.less';
const { Meta } = Card;
const HeaderGroup = () => {
  return (
    <Card className={styles.headersheild}>
      <Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title="加分审批"
        description="Score Of Approvement"
      />
    </Card>
  );
};

export default HeaderGroup;

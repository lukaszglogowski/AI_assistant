import { IconButton } from 'components/IconButton';
import React, { useState } from 'react';
import { buildCssClass } from 'utils/css/builders';

import styles from './TopBar.module.scss';
import { RelativeContentBox } from 'components/RelativeContentBox';
import { BsQuestionLg } from 'react-icons/bs';

export type TopBarProps = {

};

export const TopBar = (props: TopBarProps) => {


  const conatinerClassObj = {
    [styles.container]: true,
  }
  
  return (
    <div className={buildCssClass(conatinerClassObj)}>
      <div>
        <RelativeContentBox
          positioning='Bottom'
          alignment='End'
          buttonComponent={IconButton}
          buttonContent={<BsQuestionLg/>}
        >
          test 123!
        </RelativeContentBox>
      </div>
    </div>
  )
};

TopBar.defaultProps = {

};

export default TopBar;
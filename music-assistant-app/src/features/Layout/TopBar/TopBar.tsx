import { IconButton } from 'components/IconButton';
import React, { useState } from 'react';
import { buildCssClass } from 'utils/css/builders';

import { BsQuestionLg } from 'react-icons/bs'

import styles from './TopBar.module.scss';
import { RelativeContentBox } from 'components/RelativeContentBox';

export type TopBarProps = {

};

export const TopBar = (props: TopBarProps) => {

  const [helpActive, setHelpActive] = useState<boolean>(false);

  const conatinerClassObj = {
    [styles.container]: true,
  }
  
  return (
    <div className={buildCssClass(conatinerClassObj)}>
      <div>
        <IconButton
          onClick={() => setHelpActive(!helpActive)}
          active={helpActive}
        >
          <BsQuestionLg/>
        </IconButton>
        <RelativeContentBox></RelativeContentBox>
      </div>
    </div>
  )
};

TopBar.defaultProps = {

};

export default TopBar;
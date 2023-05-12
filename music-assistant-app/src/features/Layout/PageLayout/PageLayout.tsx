import React from 'react';
import { buildCssClass } from 'utils/css/builders';
import { ChildrenProps } from 'utils/propsTypes';
import { TopBar } from '../TopBar';

import styles from './PageLayout.module.scss';
import ModalSystem from '../ModalSystem/ModalSystem';

export type PageLayoutProps = ChildrenProps;

export const PageLayout = (props: PageLayoutProps) => {
  
  const classObj = {
    [styles['layout-container']]: true,
  };

  const contentClassObj = {
    [styles['content']]: true,
  };

  const footerClassObj = {
    [styles['footer']]: true,
  };

  return (
    <div className={buildCssClass(classObj)}>
      <ModalSystem>
        <TopBar/>
        <div className={buildCssClass(contentClassObj)}>
          {props.children}
        </div>
        <div className={buildCssClass(footerClassObj)}></div>
      </ModalSystem>
    </div>
  )
};

PageLayout.defaultProps = {

};

export default PageLayout;
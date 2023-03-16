import React from 'react';
import { buildCssClass } from 'utils/css/builders';
import { AbstractButtonProps } from 'utils/propsTypes';

import styles from './IconButton.module.scss';

export type IconButtonProps = AbstractButtonProps & {
  
};

export const IconButton = (props: IconButtonProps) => {

  const classObj = {
    [styles.button]: true,
    [styles.active]: !!props.active,
  }

  return (
    <div
      className={buildCssClass(classObj)}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  )
}

IconButton.defaultProps = {

}

export default IconButton
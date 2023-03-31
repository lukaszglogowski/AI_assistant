import React from 'react';
import { buildCssClass } from 'utils/css/builders';
import { AbstractButtonProps } from 'utils/propsTypes';

import styles from './IconButton.module.scss';

export type IconButtonProps = AbstractButtonProps & {
  emptySpaceSize?: 25 | 50 | 75
};

export const IconButton = (props: IconButtonProps) => {

  const classObj = {
    [styles.button]: true,
    [styles.active]: !!props.active,
    [styles.disabled]: !!props.disabled,
    [styles[`button-space-${props.emptySpaceSize}-sizing`]]: true,
  }

  return (
    <div
      className={buildCssClass(classObj)}
      onClick={(e) => {
        props.onClick && !props.disabled && props.onClick(e);
      }}
    >
      {props.children}
    </div>
  )
}

IconButton.defaultProps = {
  emptySpaceSize: 75
}

export default IconButton
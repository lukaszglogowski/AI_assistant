import React from 'react';
import { buildCssClass } from 'utils/css/builders';
import { AbstractButtonProps } from 'utils/propsTypes';

import styles from './RecordingButton.module.scss';

export type RecordingButtonProps = 
  AbstractButtonProps & {
    isOval?: boolean;
    colorClassName?: string;
};

export const RecordingButton = (props: RecordingButtonProps) => {
  const classObj = {
    [styles.container]: true,
    [props.colorClassName!!]: true,
    [styles.oval]: !!props.isOval,
    ['active']: !!props.active,
  }

  const buttonClassObj = {
    [styles.recordingButton]: true,
    [styles.oval]: !!props.isOval,
  }

  const bgRippleClassObj = {
    [styles['bg-ripple']]: true,
    [styles.active]: !!props.active,
  }

  return (
    <div className={buildCssClass(classObj)}>
      <div 
        onClick={props.onClick}
        className={buildCssClass(buttonClassObj)}
      >
        {props.children}
      </div>
      <div className={buildCssClass(bgRippleClassObj, styles['animation-deley-1'])}/>
      <div className={buildCssClass(bgRippleClassObj, styles['animation-deley-2'])}/>
      <div className={buildCssClass(bgRippleClassObj, styles['animation-deley-3'])}/>
    </div>
  );
};

RecordingButton.defaultProps = {
  isOval: true,
  colorClassName: styles['default-color']
};

export default RecordingButton;
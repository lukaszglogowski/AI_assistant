import React from 'react';

import styles from './Divider.module.scss';

export type DividerProps = {

};

export const Divider = (props: DividerProps) => {

  return (
    <div className={styles.divider}></div>
  );
};

Divider.defaultProps = {

};

export default Divider;
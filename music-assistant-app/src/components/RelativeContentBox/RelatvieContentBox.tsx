import React, { useRef } from 'react';
import { buildCssClass } from 'utils/css/builders';

import styles from './RelativeContentBox.module.scss';

export type RelativeContentBox = {

}

export const RelativeContentBox = (props: RelativeContentBox) => {

  const conatinerRef = useRef<HTMLDivElement | null>(null)

  const classObj = {
    [styles['content-box-position']]: true,
  };

  console.log('r')

  if(conatinerRef && conatinerRef.current) {
    if (conatinerRef.current?.getBoundingClientRect().x! + document.documentElement.scrollLeft + 100 > window.innerWidth) {
      classObj[styles['right']] = true;
    }
  }



  return (
    <div ref={conatinerRef}>
      <div className={buildCssClass(classObj)}>

      </div>
    </div>
  )
}

RelativeContentBox.defaultProps = {

}

export default RelativeContentBox;

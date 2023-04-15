

import { ChildrenProps } from 'utils/propsTypes';
import styles from './ErrorMessage.module.scss';
import { BiErrorAlt } from 'react-icons/bi';

export type ErrorMessageProps = ChildrenProps & {

};

export const ErrorMessage = (props: ErrorMessageProps) => {

  return (
    <div className={styles['container']}>
      <div className={styles['icon']}>
        <BiErrorAlt />
      </div>
      {props.children}
    </div>
  )
}

ErrorMessage.defaultProps = {

}

export default ErrorMessage;
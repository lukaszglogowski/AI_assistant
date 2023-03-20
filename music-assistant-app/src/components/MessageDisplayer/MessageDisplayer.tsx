import MessageContext from 'contexts/MessageContext';
import React, { useContext } from 'react';
import { ChildrenProps } from 'utils/propsTypes';

import styles from './MessageDisplayer.module.scss';

export type MessageDisplayerProps = {

};

export const MessageDisplayer = (props: MessageDisplayerProps) => {

  const {message} = useContext(MessageContext);

  return (
    <div className={styles['message-displayer']}>
      {message}
    </div>
  )
}

MessageDisplayer.defaultProps = {

}

export default MessageDisplayer;

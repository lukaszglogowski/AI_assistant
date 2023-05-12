import ModalSystemContext from 'contexts/ModalSystemContext';
import React, {useState} from 'react';
import { ChildrenProps } from 'utils/propsTypes';

import styles from './ModalSystem.module.scss'
import { Divider } from 'components/Divider';
import { IconButton } from 'components/IconButton';
import { AiOutlineClose } from 'react-icons/ai';
import { BiArrowBack} from 'react-icons/bi';
import { MdCheck } from 'react-icons/md';

export interface ModalDataInt {
  header?: React.ReactNode;
  body?: React.ReactNode;
  onOk?: ((event: React.MouseEvent<Element, MouseEvent>) =>
    boolean) | boolean;
  onCancel?: ((event: React.MouseEvent<Element, MouseEvent>) =>
    boolean) | boolean;
  onClose?: ((event: React.MouseEvent<Element, MouseEvent>) =>
    boolean) | boolean;
}

const exmp = {
  header: '1',
  body: '2323',
  onOk: () => true,
  onCancel: () => true,
  onClose: () => true,
}

const ModalSystem = (props: ChildrenProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalDataInt | null>(null);
  return (
    <ModalSystemContext.Provider value={{
      open: () => setIsOpen(true),
      setModalData: setModalData,
      isOpen: isOpen,
    }}>
      {
        isOpen && modalData &&
        <div className={styles['main-container']}>
          <div className={styles['content-box']}>
            {
              (modalData.header || modalData.onClose) &&
                <>
                  <div className={styles['header']}>
                    {modalData.header && <div className={styles['header-title']}>{modalData.header}</div>}
                    {modalData.onClose && <div className={styles['header-close']}>
                      <IconButton onClick={(e) => {
                        let close = true;
                        if (modalData && modalData.onClose && typeof modalData.onClose === 'function') close = modalData.onClose(e);
                        if (close) setIsOpen(!isOpen);
                      }}><AiOutlineClose/></IconButton>
                      </div>}
                  </div>
                  <Divider></Divider>
                </>
            }
            {
              (modalData.body) &&
                <>
                  {modalData.body}
                  <Divider></Divider>
                </>
            }
            {
              (modalData.onCancel || modalData.onOk) &&
                <div className={styles['footer']}>
                  {modalData.onCancel && <IconButton 
                    onClick={(e) => {
                      let close = true;
                      if (modalData && modalData.onCancel && typeof modalData.onCancel === 'function') close = modalData.onCancel(e);
                      if (close) setIsOpen(!isOpen);
                    }}><BiArrowBack/>
                  </IconButton>}
                  {modalData.onOk && <IconButton 
                    onClick={(e) => {
                      let close = true;
                      if (modalData && modalData.onOk && typeof modalData.onOk === 'function') close = modalData.onOk(e);
                      if (close) setIsOpen(!isOpen);
                    }}><MdCheck/>
                  </IconButton>}
                </div>
            }
          </div>
        </div>
      }
      {/*<Modal
        {...(modalData && modalData.modalSettings ?
          modalData.modalSettings : {})}
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        className={props.className}
        style={props.style}
        returnFocusAfterClose={false}
      >
        <ModalHeader toggle={(e) => {
          let close = true;
          if (modalData && modalData.onClose) close = modalData.onClose(e);
          if (close) setIsOpen(!isOpen);
        }}
        >
          {modalData && modalData.header ? modalData.header : ''}
        </ModalHeader>
        <ModalBody>
          {modalData && modalData.body ? modalData.body : ''}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => {
            let close = true;
            if (modalData && modalData.onOk) close = modalData.onOk(e);
            if (close) setIsOpen(!isOpen);
          }}
          >
            Ok
          </Button>{' '}
          <Button color="secondary" onClick={(e) => {
            let close = true;
            if (modalData && modalData.onCancel) close = modalData.onCancel(e);
            if (close) setIsOpen(!isOpen);
          }}
          >
            Cancel
          </Button>
        </ModalFooter>
        </Modal>*/}
        {props.children}
    </ModalSystemContext.Provider>
  );
};

export default ModalSystem;

import { ErrorMessage } from 'components/ErrorMesasge'
import { ModalSystemContextInt } from 'contexts/ModalSystemContext'

import styles from './ErrorMessage.module.scss'

export const openErrorMessage = (modalContext: ModalSystemContextInt | null, message: React.ReactNode, title?: React.ReactNode, closable = true) => {

  modalContext?.setModalData({
    onClose: closable,
    header: title ? title : 'Wystąpił błąd',
    body: (
      <div className={styles['container']}>
        <ErrorMessage><div className={styles['message']}>{message}</div></ErrorMessage>
      </div>
    ),
  })
  modalContext?.open()
}
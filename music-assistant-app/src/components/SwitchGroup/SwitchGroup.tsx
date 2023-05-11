
import { OnClickProps } from 'utils/propsTypes';
import styles from './SwitchGroup.module.scss';
import { useEffect, useState } from 'react';
import { buildCssClass } from 'utils/css/builders';

export type SwitchGroupProps = {
  buttons: ({
    id: string;
    content: React.ReactNode;
  } & OnClickProps)[];
  activeBtn: string;
};

export const SwitchGroup = (props: SwitchGroupProps) => {

  const [btns, setBtns] = useState<JSX.Element[]>([]);
  const [active, setActive] = useState(props.activeBtn)

  useEffect(() => {
    const mappedBtns = props.buttons.map((btnProps, i) => {
      const btnClassObj = buildCssClass({
        [styles['button']]: true,
        [styles['active']]: active === btnProps.id,
      });
      return(
        <div 
          key={i + '_' + btnProps.id} 
          className={btnClassObj}
          onClick={(e) => {
            setActive(btnProps.id)
            btnProps.onClick && btnProps.onClick(e)
          }}>
          {btnProps.content}
        </div>
      );
    });
    setBtns(mappedBtns)
  }, [props.buttons, active])

  useEffect(() => setActive(props.activeBtn), [props.activeBtn])

  return(
    <div className={styles['container']}>
      {btns}
    </div>
  );
};

SwitchGroup.defaultProps = {};

export default SwitchGroup;

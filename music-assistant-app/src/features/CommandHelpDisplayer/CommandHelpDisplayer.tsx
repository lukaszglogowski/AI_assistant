import React from 'react';

import { CommandData, commands } from 'commands/commands';

import styles from './CommandHelpDisplayer.module.scss'
import { Divider } from 'components/Divider';


const CommandInstance = (props: {data: CommandData}) => {
  return (
    <div className={styles['command-instance-container']}>
      <div className={styles['command-instance-container__title']}>{props.data.commandName}</div>
      <div className={styles['command-instance-container__commands']}>
        Wywoływana przez: {props.data.command.map((el, i) => (<>{(i !== 0) && ', '}<span className={styles.command}>'{el}'</span></>))}
      </div>
      <div className={styles['command-instance-container__description']}>{props.data.description}</div>
    </div>
  )
}


export type CommandHelpDisplayerProps = {

}

export const CommandHelpDisplayer = (props: CommandHelpDisplayerProps) => {

  return (
    <div className={styles['command-help-conatiner']}>
      <span className={styles['command-help-conatiner__title']}>Dostępne komendy</span>
        <div>
              {commands.map((item) => (
                <>
                  <Divider/>
                  <CommandInstance data={item} />
                </>
              ))}
        </div>
    </div>
  )
}

CommandHelpDisplayer.defaultProps = {

}

export default CommandHelpDisplayer;

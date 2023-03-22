import React, { useRef } from 'react';

import { CommandData, createCommands } from 'commands/commands';

import styles from './CommandHelpDisplayer.module.scss'
import { Divider } from 'components/Divider';


const CommandInstance = (props: {data: CommandData}) => {
  return (
    <div className={styles['command-instance-container']}>
      <div className={styles['command-instance-container__title']}>{props.data.commandName}</div>
      <div className={styles['command-instance-container__commands']}>
        Powiedz: {props.data.command.map((el, i) => (
          <React.Fragment key={el}>{(i !== 0) && ', '}<span className={styles.command}>'{el.replace('*', '[szukana fraza]')}'</span></React.Fragment>
        ))}
      </div>
      <div className={styles['command-instance-container__description']}>{props.data.description}</div>
    </div>
  )
}


export type CommandHelpDisplayerProps = {

}

export const CommandHelpDisplayer = (props: CommandHelpDisplayerProps) => {

  const commands = useRef(createCommands())

  return (
    <div className={styles['command-help-conatiner']}>
      <span className={styles['command-help-conatiner__title']}>Dostępne komendy głosowe</span>
        <div>
              {commands.current.map((item) => (
                <React.Fragment key={item.commandId}>
                  <Divider/>
                  <CommandInstance data={item} />
                </React.Fragment>
              ))}
        </div>
    </div>
  )
}

CommandHelpDisplayer.defaultProps = {

}

export default CommandHelpDisplayer;

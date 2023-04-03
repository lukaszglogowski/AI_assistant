import { IconButton } from 'components/IconButton';
import React, { ComponentType, useRef, useState } from 'react';
import { BsQuestionLg } from 'react-icons/bs';
import { buildCssClass } from 'utils/css/builders';
import { AbstractButtonProps, AbstractControlProps, ChildrenProps } from 'utils/propsTypes';

import styles from './RelativeContentBox.module.scss';

export const RelativeContentBoxAlignmentEnum = {
  Start: 'start',
  End: 'end',
} as const;

export const RelativeContentBoxPositioningEnum = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom',
} as const;

export type RelativeContentBoxPositioningEnumType = keyof typeof RelativeContentBoxPositioningEnum;
export type RelativeContentBoxAlignmentEnumType = keyof typeof RelativeContentBoxAlignmentEnum;

export type RelativeContentBoxButtonProps = Omit<AbstractButtonProps, 'onClick' | 'active'>;

export type RelativeContentBox<BUTTON_PROPS extends RelativeContentBoxButtonProps> = ChildrenProps & {
  positioning: RelativeContentBoxPositioningEnumType,
  alignment: RelativeContentBoxAlignmentEnumType,
  buttonComponent: {
    props: BUTTON_PROPS,
    component: ComponentType<BUTTON_PROPS>,
    content: React.ReactNode,
  },
}

function resolvePositioningClasses(
  positioning: RelativeContentBoxPositioningEnumType,
  alignment: RelativeContentBoxAlignmentEnumType): {[key: string]: boolean} {
    const classObj: {[key: string]: boolean} = {};

    classObj[styles['positioning-' + RelativeContentBoxPositioningEnum[positioning]]] = true;

    if (positioning === 'Left' || positioning === 'Right') {
      if (alignment === 'Start') {
        classObj[styles['alignment-top']] = true;
      } else {
        classObj[styles['alignment-bottom']] = true;
      }
    } else {
      if (alignment === 'Start') {
        classObj[styles['alignment-left']] = true;
      } else {
        classObj[styles['alignment-right']] = true;
      }
    }

    return classObj;
  }

export const RelativeContentBox = <BUTTON_PROPS extends AbstractButtonProps, >(props: RelativeContentBox<BUTTON_PROPS>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false);
  const classObj = {
    [styles['content-box-position']]: true,
    [styles['content-box-style']]: true,
    ...resolvePositioningClasses(props.positioning, props.alignment)
  };

  const handleButtonClick = () => {
    if (!active) {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    }
    setActive(!active)
  }

  const Button = props.buttonComponent.component

  return (
    <div
      ref={containerRef}
      tabIndex={1}
      style={{position: 'relative'}}
      onBlur={() => setActive(false)}
    >
      <Button
        {...props.buttonComponent.props}
        onClick={handleButtonClick}
        active={active}
      >
        {props.buttonComponent.content}
      </Button>
      {active && <div className={buildCssClass(classObj)}>
        {props.children}
      </div>}
    </div>
  )
}

RelativeContentBox.defaultProps = {
}

export default RelativeContentBox;

import { ChildrenProps, CssProps } from './_baseProps.types';
import { OnClickProps } from './_eventProps.types';

export type AbstractControlProps = {
    active?: boolean;
}

export type AbstractStylingControlProps =
  AbstractControlProps &
  CssProps & {

};

export type AbstractButtonProps =
  ChildrenProps & 
  AbstractStylingControlProps & 
  OnClickProps & {

}
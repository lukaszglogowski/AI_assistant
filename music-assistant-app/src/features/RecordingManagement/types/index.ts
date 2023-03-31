import { Signal } from 'utils/hooks/useSignal';


export type ActiveStateUpdateProps = {
  forceActivate?: Signal,
  forceDeactivate?: Signal,
  onActiveStateChange?: (newState: boolean) => void,
};
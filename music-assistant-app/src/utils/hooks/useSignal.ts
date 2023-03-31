import { useState } from 'react';


export type Signal = boolean;

export function useSignal() {
  const [signal, setSignal] = useState<Signal>(false);

  return {
    signal: signal as Signal,
    emit: () => {setSignal(!signal);}
  }

}
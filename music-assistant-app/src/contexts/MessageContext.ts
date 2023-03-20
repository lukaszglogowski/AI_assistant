import React from 'react';

export type MessageContextType = {
  message: React.ReactNode;
  setMessage: React.Dispatch<React.SetStateAction<React.ReactNode>>
  clear: () => void;
}

export const MessageContext = React.createContext<MessageContextType>({
  message: '',
  setMessage: () => {},
  clear: () => {},
})

export default MessageContext;
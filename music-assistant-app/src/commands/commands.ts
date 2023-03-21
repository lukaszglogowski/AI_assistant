import MessageContext from "contexts/MessageContext";
import React, { useContext } from "react";



let dateTime = new Date().toLocaleString();


export type CommandData = {
  commandName: string;
  command: string[];
  callback: (...args: any[]) => unknown;
  description: React.ReactNode;
}

export const commands: CommandData[] = [
  {
    commandName: '1',
    command: ['Podaj datę i czas'],
    callback: () => {
      const context = useContext(MessageContext);
      context.setMessage(dateTime);
    },
    description: 'TEST'
  },
  {
    commandName: '2',
    command: ['Wyświetl Wikipedia'],
    callback: () => {
      window.open("https://en.wikipedia.org/wiki/React_(JavaScript_library)", '_blank', 'noopener,noreferrer');
    },
    description: 'TEST'
  },
  {
    commandName: '3',
    command: ['Wyświetl Youtube'],
    callback: () => {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley", '_blank', 'noopener,noreferrer');
    },
    description: 'TEST'
  },
];
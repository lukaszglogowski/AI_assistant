import MessageContext from "contexts/MessageContext";
import React, { useContext } from "react";

export type CommandData = {
  commandName: string;
  command: string[];
  callback: (...args: any[]) => unknown;
  description: React.ReactNode;
}

export const commands: CommandData[] = [
  {
    commandName: 'Data i czas',
    command: ['Podaj datę i czas'],
    callback: () => {
      let dateTime = new Date().toLocaleString();
      const context = useContext(MessageContext);
      context.setMessage(dateTime);
    },
    description: 'Podaje obecną date i godzinę dla lokalnej strefy czasowej'
  },
  {
    commandName: 'Wikipedia',
    command: ['Wyszukaj w Wikipedii *'],
    callback: (search) => {
      console.log(search);
      const url = new URL('https://pl.wikipedia.org/w/index.php')

      url.searchParams.append('search', search)
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    description: 'Wyszukuje w serwisie Wikipedia daną frazę'
  },
  {
    commandName: 'Youtube',
    command: ['Wyszukaj w Youtube *'],
    callback: (search) => {
      console.log(search);
      const url = new URL('https://www.youtube.com/results')

      url.searchParams.append('search_query', search)
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    description: 'Wyszukuje w serwisie Youtube daną frazę'
  },
];
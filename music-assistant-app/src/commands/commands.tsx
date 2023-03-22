import React from "react";

export const CommandEnum = {
  DateTime: 'DateTime',
  Youtube: 'Youtube',
  Wikipedia: 'Wikipedia'
} as const;

export type CommandEnumT = keyof typeof CommandEnum;

export type CommandData = {
  commandId: CommandEnumT;
  commandName: string;
  command: string[];
  callback: (...args: any[]) => unknown;
  description: React.ReactNode;
}

export function createCommands(effects: {[key in CommandEnumT]?: (...args: any[]) => any} = {}): CommandData[] {
  const commands: CommandData[] = [
    {
      commandId: 'DateTime',
      commandName: 'Data i czas',
      command: ['Podaj datę i czas'],
      callback: () => {
        let dateTime = new Date().toLocaleString();
        effects.DateTime && effects.DateTime(dateTime)
      },
      description: 'Wyświetla na ekranie obecną date i godzinę dla lokalnej strefy czasowej'
    },
    {
      commandId: 'Wikipedia',
      commandName: 'Wikipedia',
      command: ['Wyszukaj w Wikipedii *'],
      callback: (search) => {
        const url = new URL('https://pl.wikipedia.org/w/index.php')
  
        url.searchParams.append('search', search)
        window.open(url, '_blank', 'noopener,noreferrer');
        effects.Wikipedia && effects.Wikipedia();
      },
      description: (
        <>
          Otwiera nową kartę w przeglądarce ze stroną Wikipedii i wyszukuje w niej podaną frazę<br/>
          Przykład: <strong>'Wyszukaj w Wikipedii pies'</strong>
        </>
      )
    },
    {
      commandId: 'Youtube',
      commandName: 'Youtube',
      command: ['Wyszukaj w Youtube *'],
      callback: (search) => {
        const url = new URL('https://www.youtube.com/results')
  
        url.searchParams.append('search_query', search)
        window.open(url, '_blank', 'noopener,noreferrer');
        effects.Youtube && effects.Youtube();
      },
      description: (
        <>
          Otwiera nową kartę w przeglądarce ze stroną Youtube i wyszukuje w niej podaną frazę<br/>
          Przykład: <strong>'Wyszukaj w Youtube pies'</strong>
        </>
      )
    },
  ];

  return commands
}

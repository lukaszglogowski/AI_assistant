import { ComponentType } from 'react';

export type HistoryEntity<T> = {
  history: {
    component: ComponentType<T>;
    props: T;
  }
};

export type History = HistoryEntity<any>[];
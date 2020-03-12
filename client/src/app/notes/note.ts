export interface Note {
  _id: string;
  body: string;
  reuse: boolean;
  draft: boolean;
  toDelete: boolean;
}

export type reusable = 'true' | 'false';
export type draft = 'true' | 'false';
export type toDelete = 'true' | 'false';

export interface Note {
  _id: string;
  owner: string;
  body: string;
  reusable: boolean;
  draft: boolean;
  toDelete: boolean;
}

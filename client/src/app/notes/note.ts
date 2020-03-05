export interface Note {
  _id: string;
  creator: UserID;
  body: string;
  expirationDate: DateTime;
  addDate: DateTime;
  reusable: boolean;
  draft: boolean;
  toDelete: boolean;
}

//come back to this to fix the fields



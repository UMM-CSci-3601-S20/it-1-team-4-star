export interface Note {
  _id: string;
  creator: userID;
  body: string;
  addDate: Date;
  expirationDate: Date;
  reusable: boolean;
  draft: boolean;
  toDelete: boolean;
}

// come back to this to fix the fields
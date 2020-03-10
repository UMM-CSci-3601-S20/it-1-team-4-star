package umm3601.note;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Note {
  @ObjectId @Id
  public String _id;
  //public String owner;
  public String body;
  public boolean reuse;
  public boolean draft;
  public boolean toDelete;
}

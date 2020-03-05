package umm3601.user;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class User {

  @ObjectId @Id
  public String _id;

  public String name;
  public String email;
  public String building;
  public String officeNumber;

}

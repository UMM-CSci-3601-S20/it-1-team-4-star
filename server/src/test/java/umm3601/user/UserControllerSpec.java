package umm3601.user;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;

/**
* Tests the logic of the UserController
*
* @throws IOException
*/
public class UserControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private UserController userController;

  private ObjectId samsId;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }
  // Setup test users for testing
  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> userDocuments = db.getCollection("users");
    userDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    // add test users to testUsers
    testUsers.add(Document.parse("{\n" +
    "                    name: \"Chris\",\n" +
    "                    email: \"chris@this.that\",\n" +
    "                    building: \"Sci\",\n"+
    "                    officeNumber: \"1111\",\n"+
    "                }"));
    testUsers.add(Document.parse("{\n" +
    "                    name: \"Jake\",\n" +
    "                    email: \"Jake@this.that\",\n" +
    "                    building: \"HUM\",\n"+
    "                    officeNumber: \"1234\",\n"+
    "                }"));
    testUsers.add(Document.parse("{\n" +
    "                    name: \"Cookie\",\n" +
    "                    email: \"Cookie@this.that\",\n" +
    "                    building: \"Sci\",\n"+
    "                    officeNumber: \"1111\",\n"+
    "                }"));
    testUsers.add(Document.parse("{\n" +
    "                    name: \"Rachel\",\n" +
    "                    email: \"Rachel@this.that\",\n" +
    "                    building: \"Rachel's Office\",\n"+
    "                    officeNumber: \"4321\",\n"+
    "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("name", "Sam")
      .append("email", "sam@frogs.com")
      .append("building", "Sam's building")
      .append("officeNumber", "9999");

    userDocuments.insertMany(testUsers);
    userDocuments.insertOne(Document.parse(sam.toJson()));

    userController = new UserController(db);
  }

  // tear down database after test
  @AfterAll
  public static void tearDown() {
    db.drop();
    mongoClient.close();
  }



  @Test
  public void GetUsersByName() throws IOException {

    mockReq.setQueryString("name=Chris");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
    userController.getUsers(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    for (User user : JavalinJson.fromJson(result, User[].class)) {
      assertEquals("Chris", user.name);
    }
  }


  @Test
  public void GetUsersByBuilding() throws IOException {

    mockReq.setQueryString("building=Sci");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
    userController.getUsers(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    for (User user : JavalinJson.fromJson(result, User[].class)) {
      assertEquals("Sci", user.building);
    }
  }



  @Test
  public void GetUsersByOfficeNumber() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("officeNumber=1111");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    userController.getUsers(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (User user : JavalinJson.fromJson(result, User[].class)) {
      assertEquals(1111, user.officeNumber); // Every user should be age 37
    }
  }


  @Test
  public void GetAllUsers() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
    userController.getUsers(ctx);


    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("users").countDocuments(), JavalinJson.fromJson(result, User[].class).length);
  }

  @Test
  public void GetUsersWithIllegalOfficeNumber() {

    mockReq.setQueryString("officeNumber=abc");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    // This should now throw a `BadRequestResponse` exception because
    // our request has an officeNumber that can't be parsed to a number.
    assertThrows(BadRequestResponse.class, () -> {
      userController.getUsers(ctx);
    });
  }


  @Test
  public void GetUsersByNameAndOfficeNumber() throws IOException {

     mockReq.setQueryString("name=Chris&officeNumber=1111");
     Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
     userController.getUsers(ctx);

     assertEquals(200, mockRes.getStatus());
     String result = ctx.resultString();
     for (User user : JavalinJson.fromJson(result, User[].class)) {
       assertEquals("Chris", user.name);
       assertEquals("1111", user.officeNumber);
     }
  }

  @Test
  public void GetUserWithExistentId() throws IOException {

    String testID = samsId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));
    userController.getUser(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    User resultUser = JavalinJson.fromJson(result, User.class);

    assertEquals(resultUser._id, samsId.toHexString());
    assertEquals(resultUser.name, "Sam");
  }

  @Test
  public void GetUserWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      userController.getUser(ctx);
    });
  }

  @Test
  public void GetUserWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.getUser(ctx);
    });
  }

  @Test
  public void AddUser() throws IOException {

    String testNewUser = "{\n\t\"name\": \"Rachael\",\n\t\"building\": \"Rachael's Office\",\n\t\"email\": \"Rachael@this.this\",\n\t\"officeNumber\":\"4321\"\n}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/new");

    userController.addNewUser(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("users").countDocuments(eq("_id", new ObjectId(id))));

    //verify user was added to the database and the correct ID
    Document addedUser = db.getCollection("users").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedUser);
    assertEquals("Rachael", addedUser.getString("name"));
    assertEquals("Rachael's Office", addedUser.getString("building"));
    assertEquals("Rachael@this.this", addedUser.getString("email"));
    assertEquals("4321", addedUser.getString("officeNumber"));
  }

  @Test
  public void AddInvalidEmailUser() throws IOException {
    String testNewUser = "{\n" +
    "                    name: \"Rachel\",\n" +
    "                    email: \"This is an invalid email\",\n" +
    "                    building: \"Rachel's Office\",\n"+
    "                    officeNumber: \"4321\",\n"+
    "                }";
    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/new");
    assertThrows(BadRequestResponse.class, () -> {
      userController.addNewUser(ctx);
    });
  }

    @Test
  public void AddInvalidNameUser() throws IOException {
    // testNewUser is created without a name
    String testNewUser = "{\n" +
    "                    email: \"This is an invalid email\",\n" +
    "                    building: \"Rachel's Office\",\n"+
    "                    officeNumber: \"4321\",\n"+
    "                }";
    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/new");

    assertThrows(BadRequestResponse.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  public void AddInvalidBuildingUser() throws IOException {
    // testNewUser is created without a building
    String testNewUser = "{\n" +
    "                    name: \"Rachel\",\n" +
    "                    email: \"This is an invalid email\",\n" +
    "                    officeNumber: \"4321\",\n"+
    "                }";
    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/new");

    assertThrows(BadRequestResponse.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  public void AddInvalidOfficeNumberUser() throws IOException {
    // testNewUser is created without a officeNumber
    String testNewUser = "{\n" +
    "                    name: \"Rachel\",\n" +
    "                    email: \"This is an invalid email\",\n" +
    "                    building: \"Rachel's Office\",\n"+
    "                }";
    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/new");

    assertThrows(BadRequestResponse.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  public void DeleteUser() throws IOException {

    String testID = samsId.toHexString();

    // User exists before deletion
    assertEquals(1, db.getCollection("users").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));
    userController.deleteUser(ctx);

    assertEquals(200, mockRes.getStatus());

    // User is no longer in the database
    assertEquals(0, db.getCollection("users").countDocuments(eq("_id", new ObjectId(testID))));
  }
}

package umm3601.user;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
  }
}

package umm3601.note;

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
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;



/**
* Tests the logic of the NoteController
*
* @throws IOException
*/
public class NoteControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private NoteController noteController;

  private ObjectId ownerId;

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


  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> noteDocuments = db.getCollection("notes");
    noteDocuments.drop();
    List<Document> testNotes = new ArrayList<>();
    testNotes.add(Document.parse("{\n" +
    "                    body: \"Body A\",\n" +
    "                    reuse: true,\n" +
    "                    draft: false,\n" +
    "                    toDelete: false,\n" +
    "                }"));
    testNotes.add(Document.parse("{\n" +
    "                    body: \"Body B\",\n" +
    "                    reuse: false,\n" +
    "                    draft: true,\n" +
    "                    toDelete: true,\n" +
    "                }"));
    testNotes.add(Document.parse("{\n" +
    "                    body: \"Body C\",\n" +
    "                    reuse: false,\n" +
    "                    draft: false,\n" +
    "                    toDelete: false,\n" +
    "                }"));

    ownerId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", ownerId);
    sam = sam.append("body", "Sam")
      .append("body", "This is an example body")
      .append("reuse", true)
      .append("draft", false)
      .append("toDelete", false);


    noteDocuments.insertMany(testNotes);
    noteDocuments.insertOne(Document.parse(sam.toJson()));

    noteController = new NoteController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllNotes() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");
    noteController.getNotes(ctx);


    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("notes").countDocuments(), JavalinJson.fromJson(result, Note[].class).length);
  }




  /**
  * Test for existing body
  */
  @Test
  public void GetNotesByBody() throws IOException {  mockReq.setQueryString("body=Body B");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");
    noteController.getNotes(ctx);    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals("Body B", note.body);
    }
  }



  /**
  * Test for true reuse
  */
  @Test
  public void GetNotesByReuse() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("reuse=true");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/status");

    noteController.getNotes(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(true, note.reuse);
    }
  }


  /**
  * Test for true draft
  */
  @Test
  public void GetNotesByDraft() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("draft=true");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/status");

    noteController.getNotes(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(true, note.draft);
    }
  }


  /**
  * Test for true toDelete
  */
  @Test
  public void GetNotesByToDelete() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("toDelete=false");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");

    noteController.getNotes(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(false, note.toDelete);
    }
  }



  @Test
  public void AddNote() throws IOException {

    String testNewNote = "{ "
      + "\"body\": \"Body C\", "
      + "\"reuse\": false, "
      + "\"draft\": false, "
      + "\"toDelete\": false }";

    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    noteController.addNewNote(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("notes").countDocuments(eq("_id", new ObjectId(id))));

    //verify note was added to the database and the correct ID
    Document addedNote = db.getCollection("notes").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedNote);
    assertEquals("Body C", addedNote.getString("body"));
    assertEquals(false, addedNote.getBoolean("reuse"));
    assertEquals(false, addedNote.getBoolean("draft"));
    assertEquals(false, addedNote.getBoolean("toDelete"));
  }



  @Test
  public void AddInvalidReuse() throws IOException {
    String testNewNote = "{\n\t\"body\": \"test body\",\n\t\"reuse\":\"invalidBoolean\",\n\t\"draft\":true,\n\t\"toDelete\":false\n}";
    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    assertThrows(BadRequestResponse.class, () -> {
      noteController.addNewNote(ctx);
    });
  }

  @Test
  public void AddInvalidDraft() throws IOException {
    String testNewNote = "{\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":\"invalidBoolean\",\n\t\"toDelete\":false\n}";
    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    assertThrows(BadRequestResponse.class, () -> {
      noteController.addNewNote(ctx);
    });
  }

  @Test
  public void AddInvalidToDelete() throws IOException {
    String testNewNote = "{\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":true,\n\t\"toDelete\":\"invalidBoolean\"\n}";
    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    assertThrows(BadRequestResponse.class, () -> {
      noteController.addNewNote(ctx);
    });
  }

  @Test
  public void DeleteNote() throws IOException {

    String testID = ownerId.toHexString();

    // Note exists before deletion
    assertEquals(1, db.getCollection("notes").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/:id", ImmutableMap.of("id", testID));
    noteController.deleteNote(ctx);

    assertEquals(200, mockRes.getStatus());

    // Note is no longer in the database
    assertEquals(0, db.getCollection("notes").countDocuments(eq("_id", new ObjectId(testID))));
  }

}

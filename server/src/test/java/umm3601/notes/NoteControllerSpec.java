package umm3601.notes;

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
    "                    owner: \"mongoID_a\",\n" +
    "                    body: \"Body A\",\n" +
    "                    reuse: true,\n" +
    "                    draft: false,\n" +
    "                    toDelete: false,\n" +
    "                }"));
    testNotes.add(Document.parse("{\n" +
    "                    owner: \"mongoID_b\",\n" +
    "                    body: \"Body B\",\n" +
    "                    reuse: false,\n" +
    "                    draft: true,\n" +
    "                    toDelete: true,\n" +
    "                }"));
    testNotes.add(Document.parse("{\n" +
    "                    owner: \"mongoID_c\",\n" +
    "                    body: \"Body C\",\n" +
    "                    reuse: false,\n" +
    "                    draft: false,\n" +
    "                    toDelete: false,\n" +
    "                }"));

    ownerId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", ownerId);
    sam = sam.append("owner", "Sam")
      .append("owner", "588935f5556f992bf8f37c01")
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


    assertEquals(200, mockRes.getReuse());

    String result = ctx.resultString();
    assertEquals(db.getCollection("notes").countDocuments(), JavalinJson.fromJson(result, Note[].class).length);
  }

  /**
  * Test for existing owner
  */
  @Test
  public void GetNotesByOwner() throws IOException {    mockReq.setQueryString("owner=mongoID_a");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");
    noteController.getNotes(ctx);    assertEquals(200, mockRes.getReuse());
    String result = ctx.resultString();
    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals("mongoID_a", note.owner);
    }
  }

  /**
  * Test for non-existing owner
  */
  @Test
  public void GetNotesWithIllegalOwner() {    mockReq.setQueryString("owner=DNE");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");    // This should now throw a `BadRequestResponse` exception because
    // our request has an owner that can't be parsed to a number.
    assertThrows(BadRequestResponse.class, () -> {
      noteController.getNotes(ctx);
    });
  }

  /**
  * Test for existing body
  */
  @Test
  public void GetNotesByBody() throws IOException {    mockReq.setQueryString("body=Body B");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");
    noteController.getNotes(ctx);    assertEquals(200, mockRes.getReuse());
    String result = ctx.resultString();
    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals("Body B", note.body);
    }
  }

  /**
  * Test for non-existing body
  */
  @Test
  public void GetNotesWithIllegalBody() {    mockReq.setQueryString("body=DNE");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");    // This should now throw a `BadRequestResponse` exception because
    // our request has an body that can't be parsed to a number.
    assertThrows(BadRequestResponse.class, () -> {
      noteController.getNotes(ctx);
    });
  }

  /**
  * Test for false reuse
  */
  @Test
  public void GetNotesByReuse() throws IOException {    // Set the query string to test with
    mockReq.setQueryString("reuse=true");    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/reuse");    noteController.getNotes(ctx);    assertEquals(200, mockRes.getReuse()); // The response reuse should be 200    String result = ctx.resultString();    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(true, note.reuse); // Every note should have reuse true
    }


  /**
  * Test for false reuse
  */
  @Test
  public void GetNotesByReuse() throws IOException {    // Set the query string to test with
    mockReq.setQueryString("reuse=true");    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/reuse");    noteController.getNotes(ctx);    assertEquals(200, mockRes.getReuse()); // The response reuse should be 200    String result = ctx.resultString();    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(true, note.reuse);
  }

    /**
  * Test for true draft
  */
  @Test
  public void GetNotesByReuse() throws IOException {    // Set the query string to test with
    mockReq.setQueryString("draft=true");    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/reuse");    noteController.getNotes(ctx);    assertEquals(200, mockRes.getReuse()); // The response reuse should be 200    String result = ctx.resultString();    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(true, note.draft);
    }


  /**
  * Test for false draft
  */
  @Test
  public void GetNotesByReuse() throws IOException {    // Set the query string to test with
    mockReq.setQueryString("draft=true");    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/reuse");    noteController.getNotes(ctx);    assertEquals(200, mockRes.getReuse()); // The response reuse should be 200    String result = ctx.resultString();    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(true, note.draft);
  }


  /**
  * Test for true toDelete
  */
  @Test
  public void GetNotesByReuse() throws IOException {    // Set the query string to test with
    mockReq.setQueryString("toDelete=true");    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/reuse");    noteController.getNotes(ctx);    assertEquals(200, mockRes.getReuse()); // The response reuse should be 200    String result = ctx.resultString();    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(true, note.toDelete);
  }


  /**
  * Test for false toDelete
  */
  @Test
  public void GetNotesByReuse() throws IOException {    // Set the query string to test with
    mockReq.setQueryString("toDelete=true");    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/reuse");    noteController.getNotes(ctx);    assertEquals(200, mockRes.getReuse()); // The response reuse should be 200    String result = ctx.resultString();    for (Note note : JavalinJson.fromJson(result, Note[].class)) {
      assertEquals(true, note.toDelete);
  }



  @Test
  public void GetNotesByCompanyAndbody() throws IOException {

    mockReq.setQueryString("company=OHMNET&body=37");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");
    noteController.getNotes(ctx);

    assertEquals(200, mockRes.getReuse());
    String result = ctx.resultString();
    Note[] resultNotes = JavalinJson.fromJson(result, Note[].class);

    assertEquals(1, resultNotes.length); // There should be one note returned
    for (Note note : resultNotes) {
       assertEquals("OHMNET", note.company);
       assertEquals(37, note.body);
     }
  }




  @Test
  public void GetNoteWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/:id", ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      noteController.getNote(ctx);
    });
  }

  @Test
  public void AddNote() throws IOException {

    String testNewNote = "{\n\t\"owner\": \"Test Owner\",\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":true,\n\t\"toDelete\":false\n}";

    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    noteController.addNewNote(ctx);

    assertEquals(201, mockRes.getReuse());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("notes").countDocuments(eq("_id", new ObjectId(id))));

    //verify note was added to the database and the correct ID
    Document addedNote = db.getCollection("notes").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedNote);
    assertEquals("Test Owner", addedNote.getString("owner"));
    assertEquals("test body", addedNote.getString("body"));
    assertEquals(true, addedTodo.getBoolean("reuse"));
    assertEquals(true, addedTodo.getBoolean("draft"));
    assertEquals(false, addedTodo.getBoolean("toDelete"));
  }

  @Test
  public void AddInvalidDraftOwner() throws IOException {
    String testNewNote = "{\n\t\"owner\": \"Test OwnerA@123#$487120881***\",\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":true,\n\t\"toDelete\":false\n}";
    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    assertThrows(BadRequestResponse.class, () -> {
      noteController.addNewNote(ctx);
    });
  }

  @Test
  public void AddInvalidOwner() throws IOException {
    String testNewNote = "{\n\t\"owner\": \"Test OwnerA@123#$487120881***\",\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":true,\n\t\"toDelete\":false\n}";
    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    assertThrows(BadRequestResponse.class, () -> {
      noteController.addNewNote(ctx);
    });
  }


  @Test
  public void AddInvalidDraftOwner() throws IOException {
    String testNewNote = "{\n\t\"owner\": \"Test Owner\",\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":true,\n\t\"toDelete\":false\n}";
    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    assertThrows(BadRequestResponse.class, () -> {
      noteController.addNewNote(ctx);
    });
  }


  @Test
  public void AddInvalidReuse() throws IOException {
    String testNewNote = "{\n\t\"owner\": \"Test Owner\",\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":true,\n\t\"toDelete\":false\n}";
    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    assertThrows(BadRequestResponse.class, () -> {
      noteController.addNewNote(ctx);
    });
  }

  @Test
  public void AddInvalidDraft() throws IOException {
    String testNewNote = "{\n\t\"owner\": \"Test Owner\",\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":true,\n\t\"toDelete\":false\n}";
    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/new");

    assertThrows(BadRequestResponse.class, () -> {
      noteController.addNewNote(ctx);
    });
  }

  @Test
  public void AddInvalidToDelete() throws IOException {
    String testNewNote = "{\n\t\"owner\": \"Test Owner\",\n\t\"body\": \"test body\",\n\t\"reuse\":true,\n\t\"draft\":true,\n\t\"toDelete\":false\n}";
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

    assertEquals(200, mockRes.getReuse());

    // Note is no longer in the database
    assertEquals(0, db.getCollection("notes").countDocuments(eq("_id", new ObjectId(testID))));
  }

}
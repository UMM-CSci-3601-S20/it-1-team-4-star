package umm3601.note;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonCodecRegistry;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about notes.
 */
public class NoteController {

  JacksonCodecRegistry jacksonCodecRegistry = JacksonCodecRegistry.withDefaultObjectMapper();

  private final MongoCollection<Note> noteCollection;

  /**
   * Construct a controller for notes.
   *
   * @param database the database containing note data
   */
  public NoteController(MongoDatabase database) {
    jacksonCodecRegistry.addCodecForClass(Note.class);
    noteCollection = database.getCollection("notes").withDocumentClass(Note.class)
        .withCodecRegistry(jacksonCodecRegistry);
  }

  /**
   * Get the single note specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getNote(Context ctx) {
    String id = ctx.pathParam("id");
    Note note;

    try {
      note = noteCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested note id wasn't a legal Mongo Object ID.");
    }
    if (note == null) {
      throw new NotFoundResponse("The requested note was not found");
    } else {
      ctx.json(note);
    }
  }

  /**
   * Delete the note specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteNote(Context ctx) {
    String id = ctx.pathParam("id");
    noteCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the notes.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getNotes(Context ctx) {

    List<Bson> filters = new ArrayList<Bson>(); // start with a blank document

    if (ctx.queryParamMap().containsKey("owner")) {
      filters.add(eq("owner", ctx.queryParam("owner")));
    }

    if (ctx.queryParamMap().containsKey("body")) {
      filters.add(eq("body", ctx.queryParam("body")));
    }

    if (ctx.queryParamMap().containsKey("reuse")) {
      boolean targetStatus = ctx.queryParam("reuse", Boolean.class).get();
      filters.add(eq("reuse", targetStatus));
    }

    if (ctx.queryParamMap().containsKey("draft")) {
      boolean targetStatus = ctx.queryParam("draft", Boolean.class).get();
      filters.add(eq("draft", targetStatus));
    }

    if (ctx.queryParamMap().containsKey("toDelete")) {
      boolean targetStatus = ctx.queryParam("toDelete", Boolean.class).get();
      filters.add(eq("toDelete", targetStatus));
    }

    String sortBy = ctx.queryParam("sortby", "owner");
    String sortOrder = ctx.queryParam("sortorder", "asc");

    System.out.println(filters);

    ctx.json(noteCollection.find(filters.isEmpty() ? new Document() : and(filters))
      .sort(sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy))//sorting
      .into(new ArrayList<>()));
  }

  /**
   * Get a JSON response with a list of all the notes.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewNote(Context ctx) {
    Note newNote = ctx.
    bodyValidator(Note.class)
    .check((usr) -> usr.owner != null && usr.owner.length() > 1 && usr.owner.length() < 36) //Verify that the todo has a owner that is not blank and is less than 35 characters long
    .check((usr) -> usr.body != null && usr.body.length() > 0 && usr.body.length() < 151) // Verify that the todo has a body that is not blank and is less than 150 characters long
    .check((usr) -> usr.reuse == true || false) // Verify that the input is a boolean value
    .check((usr) -> usr.draft == true || false) // Verify that the input is a boolean value
    .check((usr) -> usr.toDelete == true || false) // Verify that the input is a boolean value
    .get();

    noteCollection.insertOne(newNote);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newNote._id));
  }

  /**
   * Utility function to generate the md5 hash for a given string
   *
   * @param str the string to generate a md5 for
   */
  public String md5(String str) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("MD5");
    byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

    String result = "";
    for (byte b : hashInBytes) {
      result += String.format("%02x", b);
    }
    return result;
  }
}

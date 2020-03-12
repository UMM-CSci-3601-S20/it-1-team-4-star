package umm3601;

import java.util.Arrays;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;

import umm3601.user.UserController;
import umm3601.note.NoteController;

public class Server {

  static String appName = "DoorBoard - Your Office Door, Made Simple";

  private static MongoDatabase database;

  public static void main(String[] args) {

    // Get the MongoDB address and database name from environment variables and
    // if they aren't set, use the defaults of "localhost" and "dev".
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
    String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    // Get the database
    database = mongoClient.getDatabase(databaseName);

    // Initialize dependencies
    UserController userController = new UserController(database);
    NoteController noteController = new NoteController(database);
    //UserRequestHandler userRequestHandler = new UserRequestHandler(userController);

    Javalin server = Javalin.create().start(4567);


    // Utility routes
    server.get("api", ctx -> ctx.result(appName));

    // Get specific user
    server.get("api/users/:id", userController::getUser);

    // Get specific note
    server.get("api/notes/:id", noteController::getNote);

    // Delete a specific user
    server.delete("api/users/:id", userController::deleteUser);

    // Delete a specific note
    server.delete("api/notes/:id", noteController::deleteNote);

    // List users, filtered using query parameters
    server.get("api/users", userController::getUsers);

    // List deleted notes
    server.get("api/notes/deleted", noteController::getNotes);

    // List notes, filtered using query parameters
    server.get("api/notes", noteController::getNotes);

    // Add new user
    server.post("api/users/new", userController::addNewUser);

    // Add new note
    server.post("api/notes/new", noteController::addNewNote);

    // Edit toDelete field
    server.patch("api/notes/:id", noteController::editToDeleteField);


    server.patch("api/notes/:id", noteController::editDraftField);

    // Edit reuse field
    server.patch("api/notes/:id", noteController::editReuseField);

    server.exception(Exception.class, (e, ctx) -> {
      ctx.status(500);
      ctx.json(e); // you probably want to remove this in production
    });
  }
}

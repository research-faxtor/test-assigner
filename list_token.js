import { Client, ID, query as Query, TablesDB } from "appwrite";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new TablesDB(client);

const eventId = "ujicobapersonality";

const response = await databases.listRows({
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  tableId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TOKEN,
  queries: [Query.equal("event_id", [eventId])],
});

console.log(response);

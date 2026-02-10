import { Client, ID, TablesDB } from "appwrite";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new TablesDB(client);

async function insertTokens(tokens) {
  const promises = tokens.map(
    async (item) =>
      await databases.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TOKEN,
        rowId: ID.unique(),
        data: {
          token: item.token,
          event_id: item.event_id,
          gender: item.gender,
        },
      }),
  );
  return Promise.all(promises);
}

// Example tokens to insert
const tokenYangInginDimasukkan = [
  {
    token:
      "https://carrol.online-assessment.co.id/3c28a3ec-f4a0-48f9-a7b4-1850b091b052?token=9OM90PYZ ",
    event_id: "tesselaras",
    gender: "P",
  },
];

// Call the function
insertTokens(tokenYangInginDimasukkan)
  .then(() => {
    const now = new Date().toLocaleString();
    console.log(`[${now}] - All tokens inserted`);
  })
  .catch(console.error);

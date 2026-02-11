import { Client, ID, TablesDB } from "appwrite";
import dotenv from "dotenv";
import ExcelJS from "exceljs";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
const databases = new TablesDB(client);

// Function to insert tokens into the database
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

// Read tokens from Excel file
// The Excel file should have columns: token, event_id, gender
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile("token_list.xlsx");
const worksheet = workbook.worksheets[0];
const data = [];
worksheet.eachRow((row, rowNumber) => {
  if (rowNumber > 1) {
    data.push({
      token: row.getCell(1).value,
      event_id: row.getCell(2).value,
      gender: row.getCell(3).value,
    });
  }
});

// Prepare tokens to be inserted
const tokenYangInginDimasukkan = data.map((row) => ({
  token: row.token,
  event_id: row.event_id,
  gender: row.gender,
}));

// Call the function
insertTokens(tokenYangInginDimasukkan)
  .then(() => {
    const now = new Date().toLocaleString();
    console.log(`[${now}] - All tokens inserted`);
  })
  .catch(console.error);

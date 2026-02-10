import client from "@/lib/appwrite_client";
import { Query, TablesDB } from "appwrite";
import { NextResponse } from "next/server";
import { promisify } from "util";

const database = new TablesDB(client);
const sleep = promisify(setTimeout);

async function getTokenForEmail(
  userId: string,
  userGender: string,
  eventId: string,
) {
  try {
    const response = await database.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      tableId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TOKEN as string,
      queries: [
        Query.equal("assigned_id", [userId]),
        Query.equal("gender", [userGender]),
        Query.equal("event_id", [eventId]),
      ],
    });
    if (response.rows.length > 0) {
      // Id already has an assigned token
      return response.rows[0].token;
    }
    return null; // No token found for this id
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
}

// Recursive function to play tepok nyamuk
async function tepokNyamuk(
  userId: string,
  userGender: string,
  eventId: string,
) {
  const precheck = await database.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
    tableId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TOKEN as string,
    queries: [
      Query.equal("temp_id", [userId]),
      Query.equal("gender", [userGender]),
      Query.equal("event_id", [eventId]),
    ],
  });

  if (precheck.rows.length > 0) {
    // Id already has an assigned token
    return precheck.rows[0].$id;
  }

  await sleep(1000 + Math.floor(Math.random() * 2500));
  // Fetch a token where "assigned_id" is empty
  const response = await database.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
    tableId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TOKEN as string,
    queries: [
      Query.isNull("temp_id"),
      Query.equal("gender", [userGender]),
      Query.equal("event_id", [eventId]),
    ],
  });

  // Response if there are no available token
  if (response.rows.length === 0) {
    return null;
  }

  const availableToken = response.rows[0]; // Get the first available token

  // Tag the token
  await database.updateRow({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
    tableId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TOKEN as string,
    rowId: availableToken.$id,
    data: { temp_id: userId },
  });

  // Recheck the token
  const checkTag = await database.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
    tableId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TOKEN as string,
    queries: [
      Query.equal("temp_id", [userId]),
      Query.equal("gender", [userGender]),
      Query.equal("event_id", [eventId]),
    ],
  });

  // Check if current "temp_id" is match with current userId
  if (checkTag.rows[0].temp_id === userId) {
    // Return id of current document
    return checkTag.rows[0].$id;
  }
  // Redo tepok nyamuk

  return tepokNyamuk(userId, userGender, eventId);
}

// Function to assign token to user's id
async function assignTokenToEmail(
  userId: string,
  userGender: string,
  eventId: string,
) {
  // Play tepok nyamuk
  const availableTokenId = await tepokNyamuk(userId, userGender, eventId);

  if (availableTokenId === null) {
    throw new Error("No token available");
  }

  // Prepare the updated document
  const updatedToken = {
    assigned_id: userId,
  };

  // Update the document with optimistic locking
  try {
    const result = await database.updateRow({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      tableId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TOKEN as string,
      rowId: availableTokenId as string,
      data: updatedToken,
    });
    console.log(result);
    return result.token; // Return the token to the user
  } catch (error) {
    throw new Error(
      "Token was already assigned by another request. Please try again.",
    );
  }
}

async function submitUserId(
  userId: string,
  userGender: string,
  eventId: string,
) {
  const userToken = await getTokenForEmail(userId, userGender, eventId);
  if (userToken === null) {
    const userToken = await assignTokenToEmail(userId, userGender, eventId);
    return userToken;
  }
  return userToken;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = id;
    const url = new URL(req.url);
    const userGender = url.searchParams.get("gender") || "";
    const eventId = url.searchParams.get("event_id") || "";

    console.log(`${userId} - ${userGender} - ${eventId}`);
    const userToken = await submitUserId(userId, userGender, eventId);
    return NextResponse.json({ message: userToken });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}

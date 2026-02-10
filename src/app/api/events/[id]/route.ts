import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = id;
  if (
    userId == "eventbirofatiya" ||
    userId == "eventbirodewati" ||
    userId == "normingftpi2"
  ) {
    return NextResponse.json({ message: "valid" });
  }
  return NextResponse.json({ error: "invalid" }, { status: 500 });
}

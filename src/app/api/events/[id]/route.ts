import { NextResponse } from "next/server";
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = id;
  if (
    userId == "normingftpi2" ||
    userId == "ujicobaflsi" ||
    userId == "SelarasMale" ||
    userId == "SelarasFemale" ||
    userId == "fcat2binus"
  ) {
    return NextResponse.json({ message: "valid" });
  }
  return NextResponse.json({ error: "invalid" }, { status: 500 });
}

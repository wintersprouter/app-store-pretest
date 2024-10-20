import { lookupSchema } from "@/services/apis";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  [key: string]: z.infer<typeof lookupSchema>;
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "Missing ids parameter" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `https://itunes.apple.com/tw/lookup?id=${ids}`,
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch data ${error}` },
      { status: 500 },
    );
  }
}

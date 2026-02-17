import { NextResponse } from "next/server";
import { CustomizedError } from "./error";

export const throwError = async (error: unknown) => {
  if (error instanceof CustomizedError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode },
    );
  }

  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 },
  );
};

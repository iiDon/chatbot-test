import { CustomizedError } from "./error";

export const returnError = (
  error: unknown,
): { success: false; message: string } => {
  if (error instanceof CustomizedError) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: false,
    message: "Internal server error",
  };
};

import { UIMessage } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasText = (message: UIMessage) =>
  message.parts.some((part) => part.type === "text" && part.text.length > 0);

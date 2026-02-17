import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { sendMessageSchema } from "@/schemas/chat";
import { ChatStatus } from "ai";
import { ArrowUp, Globe, StopCircle } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import z from "zod";

const ChatInput = ({
  status,
  onStop,
}: {
  status?: ChatStatus;
  onStop?: () => void;
}) => {
  const methods = useFormContext<z.infer<typeof sendMessageSchema>>();
  const webSearch = useWatch({ control: methods.control, name: "webSearch" });

  return (
    <div className="flex items-center w-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Toggle
              pressed={webSearch}
              onPressedChange={(pressed) =>
                methods.setValue("webSearch", pressed)
              }
            >
              <Globe className="size-4" />
            </Toggle>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Web Search</p>
        </TooltipContent>
      </Tooltip>
      <Input
        type="text"
        placeholder="Ask anything"
        {...methods.register("messages.0.content")}
        className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
      />
      <Button
        disabled={status !== "ready" || !methods.formState.isValid}
        type="submit"
        size="icon"
        variant="ghost"
        className={cn(status === "streaming" && "hidden")}
      >
        <ArrowUp className="size-4" />
      </Button>
      <Button
        size="icon"
        className={cn(
          "bg-[#01692B] text-white",
          status !== "streaming" && "hidden",
        )}
        onClick={onStop}
        variant="ghost"
      >
        <StopCircle className="size-4" />
      </Button>
    </div>
  );
};

export default ChatInput;

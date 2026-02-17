import type { ChatStatus, UIMessage } from "ai";
import Markdown from "react-markdown";
import { ExternalLink } from "lucide-react";
import { AIResponseResualtType } from "@/types/types";

type AssistantMessageBodyProps = {
  message: UIMessage;
  status?: ChatStatus;
};

const AssistantMessageBody = ({
  message,
  status,
}: AssistantMessageBodyProps) => {
  const toolSources = message.parts
    .filter(
      (part) =>
        part.type === "tool-webSearch" && part.state === "output-available",
    )
    .flatMap((part) => {
      const output = (
        part as { output?: { results?: AIResponseResualtType[] } }
      ).output;

      const results = output?.results;

      if (!Array.isArray(results)) return [];

      return results.map((r) => ({
        url: r.url,
        title: r.title,
      }));
    });

  const dbSources =
    (
      message.metadata as {
        sources?: AIResponseResualtType[];
      }
    )?.sources ?? [];

  const sources = toolSources.length > 0 ? toolSources : dbSources;

  return (
    <div className="flex-1 min-w-0 space-y-2">
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "text":
            return (
              <div
                key={`${message.id}-${i}`}
                className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-secondary prose-pre:rounded-xl prose-code:text-foreground"
              >
                <Markdown
                  components={{
                    img: ({ src, alt }) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={alt ?? ""}
                        className="rounded-xl max-w-sm my-2"
                        loading="lazy"
                      />
                    ),
                  }}
                >
                  {part.text}
                </Markdown>
              </div>
            );
        }
      })}
      {sources.length > 0 && status === "submitted" && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {sources.map((source, i) => (
            <a
              key={`${message.id}-source-${i}`}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-secondary rounded-full px-3 py-1 transition-colors"
            >
              <ExternalLink className="size-3" />
              {source.title ?? new URL(source.url).hostname}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssistantMessageBody;

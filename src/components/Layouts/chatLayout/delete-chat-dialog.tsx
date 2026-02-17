"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Chat } from "@/lib/prisma/generated/client";
import { useDeleteChat } from "@/hooks/use-chat";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteChatDialogItem({ chat }: { chat: Chat }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate, isPending } = useDeleteChat(chat.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Trash2 />
        <span>Delete</span>
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete chat?</DialogTitle>
          <DialogDescription>
            This will permanently delete &quot;{chat.title ?? "Untitled chat"}&quot;.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              mutate(undefined, {
                onSuccess: () => {
                  setOpen(false);
                  router.refresh();
                },
              });
            }}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

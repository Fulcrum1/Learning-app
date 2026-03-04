"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FormProvider } from "@/lib/list-form";
import ListForm from "./ListForm";

export default function ListModal({
  type,
  id,
}: {
  type: "create" | "update";
  id?: string;
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    try {
      setOpen(true);
    } catch (error) {
      console.error("Error opening modal:", error);
    } finally {
    }
  };

  return (
    <FormProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          variant="outline"
          size="sm"
          className="h-8 sm:h-10 gap-1 sm:gap-2"
          onClick={handleOpen}
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">
            {type === "create" ? "Ajouter une liste" : "Modifier une liste"}
          </span>
          <span className="sm:hidden">
            {type === "create" ? "Ajouter" : "Modifier"}
          </span>
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === "create" ? "Ajouter une liste" : "Modifier une liste"}
            </DialogTitle>
          </DialogHeader>
          <ListForm type={type} id={id} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

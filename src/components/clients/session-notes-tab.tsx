"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useSessionNotes,
  useCreateSessionNote,
  useDeleteSessionNote,
} from "@/hooks/use-session-notes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StickyNote, Plus, Trash2, Calendar } from "lucide-react";

interface SessionNotesTabProps {
  clientId: string;
}

export function SessionNotesTab({ clientId }: SessionNotesTabProps) {
  const t = useTranslations("sessionNotes");
  const tc = useTranslations("common");
  const te = useTranslations("empty");
  const { data: notes, isLoading } = useSessionNotes(clientId);
  const createNote = useCreateSessionNote();
  const deleteNote = useDeleteSessionNote();

  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleCreate = () => {
    if (!form.content.trim()) return;
    createNote.mutate(
      {
        client_id: clientId,
        date: form.date,
        title: form.title || undefined,
        content: form.content,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm({
            title: "",
            content: "",
            date: new Date().toISOString().split("T")[0],
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("title")}
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          {t("addNote")}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t("noteTitle")}</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder={t("titlePlaceholder")}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t("date")}</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t("noteContent")}</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder={t("contentPlaceholder")}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                {tc("cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={!form.content.trim() || createNote.isPending}
              >
                {tc("save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!notes || notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={te("sessionNotesTitle")}
          description={te("sessionNotesDescription")}
        />
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {note.title && (
                      <p className="font-medium text-sm">{note.title}</p>
                    )}
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {note.date}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteId(note.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={tc("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        isLoading={deleteNote.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteNote.mutate(
              { id: deleteId, clientId },
              { onSuccess: () => setDeleteId(null) }
            );
          }
        }}
      />
    </div>
  );
}

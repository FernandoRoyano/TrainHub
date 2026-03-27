"use client";

import type { Exercise } from "@/services/exercises.service";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExerciseDetailDialogProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExerciseDetailDialog({
  exercise,
  open,
  onOpenChange,
}: ExerciseDetailDialogProps) {
  const locale = useLocale();
  const te = useTranslations("exercises");

  if (!exercise) return null;

  const name =
    locale === "es" && exercise.name_es ? exercise.name_es : exercise.name;
  const description =
    locale === "es" && exercise.description_es
      ? exercise.description_es
      : exercise.description;
  const instructions =
    locale === "es" && exercise.instructions_es
      ? exercise.instructions_es
      : exercise.instructions;

  const mainImage =
    exercise.images?.[0] ?? exercise.thumbnail_url ?? null;
  const allImages = [
    ...(exercise.thumbnail_url ? [exercise.thumbnail_url] : []),
    ...(exercise.images ?? []),
  ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{name}</DialogTitle>
        </DialogHeader>

        {/* Main media */}
        <div className="w-full rounded-lg overflow-hidden bg-muted">
          {exercise.video_url ? (
            <video
              src={exercise.video_url}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-h-80 object-contain"
            />
          ) : mainImage ? (
            <img
              src={mainImage}
              alt={name}
              className="w-full max-h-80 object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-48">
              <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Additional images */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-20 h-20 rounded-md object-cover shrink-0 border"
              />
            ))}
          </div>
        )}

        {/* Muscle groups */}
        {exercise.muscle_groups?.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {exercise.muscle_groups.map((mg) => (
              <Badge key={mg} variant="outline" className="text-xs">
                {te(`muscle_${mg}` as Parameters<typeof te>[0])}
              </Badge>
            ))}
          </div>
        )}

        {/* Equipment */}
        {exercise.equipment?.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {exercise.equipment.map((eq) => (
              <Badge
                key={eq}
                variant="secondary"
                className="text-xs"
              >
                {te(`equip_${eq}` as Parameters<typeof te>[0])}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        {description && (
          <div>
            <p className="text-sm font-medium mb-1">{te("description")}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}

        {/* Instructions */}
        {instructions && (
          <div>
            <p className="text-sm font-medium mb-1">{te("instructions")}</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {instructions}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

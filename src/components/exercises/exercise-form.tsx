"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createExerciseSchema, type ExerciseFormData } from "@/lib/validations/exercise";
import {
  useCreateExercise,
  useUpdateExercise,
  useUploadMedia,
} from "@/hooks/use-exercises";
import type { Exercise } from "@/services/exercises.service";
import { MUSCLE_GROUPS, EQUIPMENT, DIFFICULTY_LEVELS, EXERCISE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

interface ExerciseFormProps {
  mode: "create" | "edit";
  exercise?: Exercise;
}

export function ExerciseForm({ mode, exercise }: ExerciseFormProps) {
  const t = useTranslations("exercises");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const router = useRouter();
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const uploadMedia = useUploadMedia();

  const [videoPreview, setVideoPreview] = useState<string | null>(
    exercise?.video_url ?? null
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    exercise?.thumbnail_url ?? null
  );
  const [isUploading, setIsUploading] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(createExerciseSchema(tv)),
    defaultValues: {
      name: exercise?.name ?? "",
      description: exercise?.description ?? "",
      instructions: exercise?.instructions ?? "",
      video_url: exercise?.video_url ?? "",
      thumbnail_url: exercise?.thumbnail_url ?? "",
      muscle_groups: exercise?.muscle_groups ?? [],
      equipment: exercise?.equipment ?? [],
      difficulty: (exercise?.difficulty as ExerciseFormData["difficulty"]) ?? "beginner",
      category: (exercise?.category as ExerciseFormData["category"]) ?? "strength",
    },
  });

  const isLoading = createExercise.isPending || updateExercise.isPending || isUploading;

  const handleFileUpload = useCallback(
    async (file: File, folder: string) => {
      setIsUploading(true);
      try {
        const url = await uploadMedia.mutateAsync({ file, folder });
        return url;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMedia]
  );

  const handleVideoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const localUrl = URL.createObjectURL(file);
      setVideoPreview(localUrl);

      const url = await handleFileUpload(file, "videos");
      form.setValue("video_url", url);
      setVideoPreview(url);
    },
    [form, handleFileUpload]
  );

  const handleThumbnailChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const localUrl = URL.createObjectURL(file);
      setThumbnailPreview(localUrl);

      const url = await handleFileUpload(file, "thumbnails");
      form.setValue("thumbnail_url", url);
      setThumbnailPreview(url);
    },
    [form, handleFileUpload]
  );

  const handleDrop = useCallback(
    (type: "video" | "thumbnail") => (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (type === "video") {
        const dt = new DataTransfer();
        dt.items.add(file);
        if (videoInputRef.current) {
          videoInputRef.current.files = dt.files;
          videoInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else {
        const dt = new DataTransfer();
        dt.items.add(file);
        if (thumbnailInputRef.current) {
          thumbnailInputRef.current.files = dt.files;
          thumbnailInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    },
    []
  );

  async function onSubmit(data: ExerciseFormData) {
    if (mode === "create") {
      createExercise.mutate(data, {
        onSuccess: () => router.push("/exercises"),
      });
    } else if (exercise) {
      updateExercise.mutate(
        { id: exercise.id, data },
        { onSuccess: () => router.push(`/exercises/${exercise.id}`) }
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/exercises">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? t("addExercise") : t("editExercise")}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("name")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("namePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("instructions")}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Category & Difficulty */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("difficulty")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DIFFICULTY_LEVELS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {t(d as Parameters<typeof t>[0])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("category")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EXERCISE_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {t(c as Parameters<typeof t>[0])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Muscle Groups */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("muscleGroups")}</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="muscle_groups"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {MUSCLE_GROUPS.map((mg) => (
                        <label
                          key={mg}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={field.value.includes(mg)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, mg]);
                              } else {
                                field.onChange(
                                  field.value.filter((v) => v !== mg)
                                );
                              }
                            }}
                          />
                          <span className="text-sm">
                            {t(`muscle_${mg}` as Parameters<typeof t>[0])}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("equipment")}</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {EQUIPMENT.map((eq) => (
                        <label
                          key={eq}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={field.value.includes(eq)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, eq]);
                              } else {
                                field.onChange(
                                  field.value.filter((v) => v !== eq)
                                );
                              }
                            }}
                          />
                          <span className="text-sm">
                            {t(`equip_${eq}` as Parameters<typeof t>[0])}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Video Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("video")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />

              {videoPreview ? (
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-64 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setVideoPreview(null);
                      form.setValue("video_url", "");
                      if (videoInputRef.current) videoInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => videoInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop("video")}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t("dragOrClick")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("maxFileSize", { size: "50" })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thumbnail Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("thumbnail")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />

              {thumbnailPreview ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    className="w-full max-h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setThumbnailPreview(null);
                      form.setValue("thumbnail_url", "");
                      if (thumbnailInputRef.current)
                        thumbnailInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => thumbnailInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop("thumbnail")}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t("dragOrClick")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("maxFileSize", { size: "5" })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/exercises">{tc("cancel")}</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tc("save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

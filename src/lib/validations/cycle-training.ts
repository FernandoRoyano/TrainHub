import { z } from "zod";

export const cycleTrainingConfigSchema = z.object({
  enabled: z.boolean(),
  menstrual_intensity: z.number().min(-50).max(50),
  menstrual_volume: z.number().min(-50).max(50),
  menstrual_notes: z.string().max(200).nullable().optional(),
  follicular_intensity: z.number().min(-50).max(50),
  follicular_volume: z.number().min(-50).max(50),
  follicular_notes: z.string().max(200).nullable().optional(),
  ovulation_intensity: z.number().min(-50).max(50),
  ovulation_volume: z.number().min(-50).max(50),
  ovulation_notes: z.string().max(200).nullable().optional(),
  luteal_intensity: z.number().min(-50).max(50),
  luteal_volume: z.number().min(-50).max(50),
  luteal_notes: z.string().max(200).nullable().optional(),
  auto_adjust: z.boolean(),
});

export type CycleTrainingConfigFormData = z.infer<typeof cycleTrainingConfigSchema>;

export const cyclePerformanceLogSchema = z.object({
  perceived_effort: z.number().min(1).max(10).optional(),
  energy_before: z.number().min(1).max(5).optional(),
  energy_after: z.number().min(1).max(5).optional(),
  performance_rating: z.number().min(1).max(5).optional(),
  training_symptoms: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
});

export type CyclePerformanceLogFormData = z.infer<typeof cyclePerformanceLogSchema>;

export const cyclePrivacySchema = z.object({
  share_phase: z.boolean(),
  share_symptoms: z.boolean(),
  share_mood: z.boolean(),
  share_flow: z.boolean(),
  share_energy: z.boolean(),
  share_predictions: z.boolean(),
  anonymous_mode: z.boolean(),
});

export type CyclePrivacyFormData = z.infer<typeof cyclePrivacySchema>;

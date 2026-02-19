import { createClient } from "@/lib/supabase/client";

export interface BodyMeasurement {
  id: string;
  client_id: string;
  date: string;
  weight: number | null;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  bicep_cm: number | null;
  thigh_cm: number | null;
  calf_cm: number | null;
  notes: string | null;
  created_at: string;
}

export type MeasurementInput = Omit<BodyMeasurement, "id" | "created_at">;

async function verifyClientOwnership(clientId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("trainer_id", user.id)
    .maybeSingle();

  if (!client) throw new Error("Client not found");
  return supabase;
}

export const measurementsService = {
  async getMeasurements(clientId: string) {
    const supabase = await verifyClientOwnership(clientId);
    const { data, error } = await supabase
      .from("body_measurements")
      .select("*")
      .eq("client_id", clientId)
      .order("date", { ascending: true });
    if (error) throw error;
    return data as BodyMeasurement[];
  },

  async createMeasurement(data: MeasurementInput) {
    const supabase = await verifyClientOwnership(data.client_id);
    const { data: measurement, error } = await supabase
      .from("body_measurements")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return measurement as BodyMeasurement;
  },

  async updateMeasurement(id: string, data: Partial<MeasurementInput>) {
    if (!data.client_id) {
      // Need to fetch the measurement to get client_id for verification
      const supabase = createClient();
      const { data: existing } = await supabase
        .from("body_measurements")
        .select("client_id")
        .eq("id", id)
        .single();
      if (!existing) throw new Error("Measurement not found");
      await verifyClientOwnership(existing.client_id);
    } else {
      await verifyClientOwnership(data.client_id);
    }

    const supabase = createClient();
    const { data: measurement, error } = await supabase
      .from("body_measurements")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return measurement as BodyMeasurement;
  },

  async deleteMeasurement(id: string) {
    const supabase = createClient();
    // Fetch measurement to verify ownership
    const { data: existing } = await supabase
      .from("body_measurements")
      .select("client_id")
      .eq("id", id)
      .single();
    if (!existing) throw new Error("Measurement not found");

    await verifyClientOwnership(existing.client_id);

    const { error } = await supabase
      .from("body_measurements")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

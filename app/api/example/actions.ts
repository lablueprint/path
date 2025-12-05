"use server";

import { ExampleType } from "@/app/types/ExampleType";
import { createClient } from "@/app/lib/supabase/server-client";

export const createExampleEntry = async (data: ExampleType) => {
  const supabase = await createClient();
  const { data: entry, error } = await supabase.from("example").insert(data);

  if (error) {
    throw error;
  }
  return entry;
}
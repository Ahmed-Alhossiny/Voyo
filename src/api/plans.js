import { supabase } from "../supabaseClient";

export async function savePlan({
  type,
  title,
  subtitle,
  planDate,
  country,
  externalId,
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("plans").insert([
    {
      user_id: user.id,
      type,
      title,
      subtitle,
      plan_date: planDate,
      country,
      external_id: externalId,
    },
  ]);

  if (error) throw error;
  return data;
}

export async function getSavedExternalIds() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("plans")
    .select("external_id")
    .eq("user_id", user.id)
    .not("external_id", "is", null);

  if (error) throw error;
  return data.map((row) => row.external_id);
}

export async function getMyPlans() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function deletePlan(planId) {
  const { error } = await supabase.from("plans").delete().eq("id", planId);
  if (error) throw error;
}

export async function deleteAllPlans() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("plans")
    .delete()
    .eq("user_id", user.id);
  if (error) throw error;
}

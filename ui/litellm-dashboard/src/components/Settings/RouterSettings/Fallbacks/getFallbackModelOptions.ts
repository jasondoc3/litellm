import { ModelGroup } from "@/components/llm_calls/fetch_models";

/**
 * The proxy expands a wildcard like "openai/*" into prefixed model groups
 * ("openai/gpt-4o"), but clients can also request the bare name ("gpt-4o"),
 * which the router resolves through the same wildcard. Offer the bare form
 * too, so fallbacks can be keyed on what clients actually send.
 */
export function getFallbackModelOptions(modelGroups: ModelGroup[]): string[] {
  const names = new Set(modelGroups.map((g) => g.model_group));
  const merged = new Set(names);
  for (const group of modelGroups) {
    const [prefix, bareName] = group.model_group.split(/\/(.+)/);
    // Only names under a registered wildcard whose prefix is the real
    // provider are routable bare (e.g. not "custom/*" pointing at openai)
    if (bareName && !bareName.includes("*") && names.has(`${prefix}/*`) && group.providers?.includes(prefix)) {
      merged.add(bareName);
    }
  }
  return Array.from(merged).sort();
}

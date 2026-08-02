export interface AppDefinition {
  name: string;
  description: string;
  /** The name this app's backend registers itself under in gatekeeper-api's
   * registry (see filezilla-api's SERVICE_NAME) — not necessarily the same
   * as `name` above, which is the product-facing display name. Undefined
   * means there's no backend to look up yet, so this always shows
   * "Not registered". Deliberately still called a "service" here — that's
   * gatekeeper-api's own terminology for a registered backend process, a
   * different concept from the apps listed in this file. */
  backendServiceName?: string;
  /** Path segment under /apps when this sub-app's UI is actually wired in
   * (e.g. "filezilla" -> /apps/filezilla). Undefined means there's nothing
   * to navigate to yet. */
  route?: string;
}

// Future/not-yet-built apps live in docs/plan.md, not here — this list is
// only ever apps that actually exist, so the Apps page never shows a
// permanent "Not registered" placeholder for something that isn't real yet.
export const apps: AppDefinition[] = [
  {
    name: "filezilla",
    description: "Upload, organize into folders, preview, and download files.",
    route: "filezilla",
    backendServiceName: "filezilla-api",
  },
  {
    name: "image-importer",
    description: "Paste a page or Instagram post URL and pull its images into filezilla.",
    route: "image-importer",
    backendServiceName: "image-importer-api",
  },
];

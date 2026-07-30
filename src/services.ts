export interface ServiceDefinition {
  name: string;
  description: string;
  /** The sub-app's UI ships as an installed package, not a runtime remote —
   * this only tracks whether its backend is currently reachable. Set once
   * the gatekeeper registry exists and reports the service as live;
   * undefined means it hasn't been seen yet. */
  apiUrl?: string;
  /** Path segment under /services when this sub-app's UI is actually wired
   * in (e.g. "filezilla" -> /services/filezilla). Undefined means there's
   * nothing to navigate to yet. */
  route?: string;
}

export const services: ServiceDefinition[] = [
  { name: "frame-extractor", description: "Upload a video, extract frames at an interval, download as a zip." },
  { name: "filezilla", description: "Upload, organize into folders, preview, and download files.", route: "filezilla" },
  { name: "lora-trainer", description: "Train an SDXL LoRA from a set of images on a throwaway cloud GPU." },
  {
    name: "image-upscaler",
    description: "Sharpen and upscale a photo 2x/4x, entirely locally — never smaller than the original.",
  },
  {
    name: "image-generator",
    description: "Generate SDXL images from a trained LoRA on a manually-controlled cloud GPU session.",
  },
  { name: "llm-chat", description: "Chat with a locally-hosted LLM — nothing leaves this machine." },
  { name: "image-importer", description: "Paste a page URL and pull every image on it into filezilla." },
  {
    name: "insta-downloader",
    description: "Paste a public Instagram post URL and pull its images (full carousels) into filezilla.",
  },
];

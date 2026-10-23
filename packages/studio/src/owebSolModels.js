/** OWeb Sol — ComfyUI on RunPod (Wan 2.2 video). */

const OWEB_SOL_PROVIDER = "oweb";
const OWEB_SOL_PROVIDER_NAME = "OWeb";

const sharedPromptInput = {
  type: "string",
  title: "Prompt",
  name: "prompt",
  description: "Describe the video you want to generate",
};

const sharedAspectRatio = {
  enum: ["16:9", "9:16", "1:1"],
  title: "Aspect Ratio",
  name: "aspect_ratio",
  type: "string",
  description: "Aspect ratio of the output video.",
  default: "16:9",
};

const sharedDuration = {
  title: "Duration",
  name: "duration",
  type: "int",
  description: "Length of the clip in seconds",
  default: 5,
  minValue: 3,
  maxValue: 8,
  step: 1,
};

const sharedResolution = {
  enum: ["480p", "720p"],
  title: "Resolution",
  name: "resolution",
  type: "string",
  description: "Output resolution",
  default: "720p",
};

/** @type {import('./models.js').VideoModel[]} */
export const OWEB_SOL_T2V_MODELS = [
  {
    id: "oweb-sol-t2v",
    name: "Oweb Sol",
    endpoint: "oweb-sol-t2v",
    inputs: {
      prompt: sharedPromptInput,
      aspect_ratio: sharedAspectRatio,
      duration: sharedDuration,
      resolution: sharedResolution,
    },
    provider: OWEB_SOL_PROVIDER,
    provider_name: OWEB_SOL_PROVIDER_NAME,
    promptRequired: true,
    generativeProviders: ["comfy-runpod"],
    comfyWorkflow: "oweb-sol",
    description:
      "OWeb’s Wan 2.2 text-to-video pipeline on ComfyUI (RunPod). Branded as Oweb Sol in the studio.",
  },
];

/** @type {import('./models.js').VideoModel[]} */
export const OWEB_SOL_I2V_MODELS = [
  {
    id: "oweb-sol-i2v",
    name: "Oweb Sol",
    endpoint: "oweb-sol-i2v",
    inputs: {
      prompt: sharedPromptInput,
      aspect_ratio: sharedAspectRatio,
      duration: sharedDuration,
      resolution: sharedResolution,
      image_url: {
        type: "string",
        title: "Reference image",
        name: "image_url",
        description: "Starting frame for image-to-video",
      },
    },
    provider: OWEB_SOL_PROVIDER,
    provider_name: OWEB_SOL_PROVIDER_NAME,
    promptRequired: false,
    generativeProviders: ["comfy-runpod"],
    comfyWorkflow: "oweb-sol",
    description: "Oweb Sol image-to-video on ComfyUI (RunPod).",
  },
];

export const OWEB_SOL_MODEL_IDS = new Set([
  ...OWEB_SOL_T2V_MODELS.map((m) => m.id),
  ...OWEB_SOL_I2V_MODELS.map((m) => m.id),
]);

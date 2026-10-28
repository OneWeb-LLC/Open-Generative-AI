import {
  getAspectRatiosForI2VModel,
  getDurationsForI2VModel,
  getDurationsForModel,
  getResolutionsForI2VModel,
  getResolutionsForVideoModel,
} from '../models.js';
import { buildVideoCommonPayload } from '../videoModelParameters.js';
import { getGroupedVideoConfiguration } from '../groupedVideoModels.js';
import {
  buildReferenceParams,
} from '../modelCapabilities.js';
import {
  buildSupplementalInputPayload,
  createModelParameterValues,
} from '../modelParameters.js';
import { buildVideoWorkflowMediaParams } from '../videoWorkflows.js';

/**
 * Build the same payload shape used for MuAPI / local cost estimates.
 * @param {{
 *   currentModel: import('../models.js').VideoModel | undefined,
 *   selectedModel: string,
 *   modelKind: 't2v' | 'i2v' | 'v2v',
 *   modelParameterValues: Record<string, unknown>,
 *   selectedAr: string,
 *   selectedDuration: number,
 *   selectedResolution: string,
 *   selectedQuality: string,
 *   selectedWorkflowId: string | null,
 *   workflowMedia: Record<string, unknown>,
 *   showEffect: boolean,
 *   selectedEffect: string,
 *   selectedVeoTool: unknown,
 *   prompt?: string,
 * }} input
 * @returns {Record<string, unknown> | null}
 */
export function buildVideoCostEstimatePayload(input) {
  const {
    currentModel,
    selectedModel,
    modelKind,
    modelParameterValues,
    selectedAr,
    selectedDuration,
    selectedResolution,
    selectedQuality,
    selectedWorkflowId,
    workflowMedia,
    showEffect,
    selectedEffect,
    selectedVeoTool,
    prompt = '',
  } = input;

  if (!currentModel || !selectedModel) return null;

  const grouped = getGroupedVideoConfiguration(selectedModel);
  const activeParameterValues = createModelParameterValues(currentModel, modelParameterValues);
  const generationParameterValues =
    grouped && currentModel.inputs?.omni_reference_task_type
      ? { ...activeParameterValues, omni_reference_task_type: 'auto' }
      : activeParameterValues;

  const commonParams = grouped
    ? buildVideoCommonPayload(currentModel, {
        ...generationParameterValues,
        aspectRatio: selectedAr,
        duration: selectedDuration,
        resolution: selectedResolution,
        quality: selectedQuality,
      })
    : {};

  const referenceParams = selectedWorkflowId
    ? buildVideoWorkflowMediaParams(currentModel, selectedWorkflowId, workflowMedia)
    : buildReferenceParams(currentModel, workflowMedia);

  const trimmedPrompt = prompt.trim();

  if (modelKind === 'v2v') {
    const v2vParams = {
      model: selectedModel,
      ...buildSupplementalInputPayload(currentModel, generationParameterValues),
      ...commonParams,
      ...referenceParams,
    };
    if (currentModel?.hasPrompt && trimmedPrompt) {
      v2vParams.prompt = trimmedPrompt;
    }
    return v2vParams;
  }

  if (modelKind === 'i2v') {
    const i2vParams = {
      model: selectedModel,
      ...buildSupplementalInputPayload(currentModel, generationParameterValues),
      ...commonParams,
      ...referenceParams,
    };
    if (trimmedPrompt) i2vParams.prompt = trimmedPrompt;
    const aspectRatios = getAspectRatiosForI2VModel(selectedModel);
    if (!grouped && aspectRatios.length > 0) i2vParams.aspect_ratio = selectedAr;
    const durations = getDurationsForI2VModel(selectedModel);
    if (!grouped && durations.length > 0) i2vParams.duration = selectedDuration;
    const resolutions = getResolutionsForI2VModel(selectedModel);
    if (!grouped && resolutions.length > 0) i2vParams.resolution = selectedResolution;
    if (!grouped && selectedQuality) i2vParams.quality = selectedQuality;
    if (showEffect && selectedEffect) i2vParams.name = selectedEffect;
    return i2vParams;
  }

  const params = {
    model: selectedModel,
    ...buildSupplementalInputPayload(currentModel, generationParameterValues),
    ...commonParams,
    ...referenceParams,
  };
  if (trimmedPrompt) params.prompt = trimmedPrompt;

  if (!grouped) {
    params.aspect_ratio = selectedAr;
  }

  const durations = getDurationsForModel(selectedModel);
  if (!grouped && durations.length > 0) params.duration = selectedDuration;
  const resolutions = getResolutionsForVideoModel(selectedModel);
  if (!grouped && resolutions.length > 0) params.resolution = selectedResolution;
  if (!grouped && !selectedVeoTool && selectedQuality) params.quality = selectedQuality;

  return params;
}

import { parseFile } from 'music-metadata';

/**
 * Validate if an audio file's duration is within the allowed limit.
 * @param {string} filePath - The path to the audio file.
 * @param {number} maxSeconds - Maximum allowed duration in seconds (default: 10).
 * @returns {Promise<boolean>} - Resolves true if valid, rejects with error if too long or failed to parse.
 */
export const validateAudioDuration = async (filePath, maxSeconds = 10) => {
  try {
    const metadata = await parseFile(filePath);
    const duration = metadata.format.duration;

    if (!duration) {
      throw new Error('Unable to determine audio duration.');
    }

    if (duration > maxSeconds) {
      throw new Error(
        `Audio is too long (${duration.toFixed(2)}s). Maximum allowed duration is ${maxSeconds} seconds. Please upload a shorter audio file.`
      );
    }

    return true;
  } catch (error) {
    throw new Error(`Audio validation failed: ${error.message}`);
  }
};

import { ReadStream } from 'fs';
import { MAXIMUM_FILE_SIZE } from './constants';

export const validateFileFormat = (
  filename: string,
  allowedFileFormats: string[],
) => {
  const fileParts = filename.split('.');
  const extension = fileParts[fileParts.length - 1];

  return allowedFileFormats.includes(extension);
};

export const validateFileSize = async (
  fileStream: ReadStream,
  allowedFileSizeInBytes: number = MAXIMUM_FILE_SIZE,
) => {
  return new Promise((resolve, reject) => {
    let fileSizeInBytes = 0;

    fileStream
      .on('data', (data: Buffer) => {
        fileSizeInBytes += data.byteLength;
      })
      .on('end', () => {
        resolve(fileSizeInBytes <= allowedFileSizeInBytes);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

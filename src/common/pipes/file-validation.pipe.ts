import { Injectable, PipeTransform } from '@nestjs/common';
import { ReadStream } from 'fs';
import { validateFileFormat, validateFileSize } from '../utils/helpers';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(value: any) {
    if (!value.filename) throw new Error('File not provided');

    const { filename, createReadStream } = value;
    const fileStream = createReadStream() as ReadStream;

    const isFileFormatValid = validateFileFormat(filename, ['png', 'jpg']);

    if (!isFileFormatValid) throw new Error('File format not valid');

    const isFileSizeValid = await validateFileSize(fileStream);

    if (!isFileSizeValid) throw new Error('File is too big');

    return value;
  }
}

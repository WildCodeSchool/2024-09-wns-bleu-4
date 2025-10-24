import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type PostFilesBodyParam = FromSchema<typeof schemas.PostFiles.body>;
export type PostFilesMetadataParam = FromSchema<typeof schemas.PostFiles.metadata>;
export type PostFilesResponse200 = FromSchema<typeof schemas.PostFiles.response['200']>;

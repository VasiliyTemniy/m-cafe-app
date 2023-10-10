// Original file: src/protos/auth.proto

import type { Long } from '@grpc/proto-loader';

export interface UpdateAuthRequest {
  'id'?: (number | string | Long);
  'lookupHash'?: (string);
  'oldPassword'?: (string);
  'newPassword'?: (string);
}

export interface UpdateAuthRequest__Output {
  'id'?: (string);
  'lookupHash'?: (string);
  'oldPassword'?: (string);
  'newPassword'?: (string);
}

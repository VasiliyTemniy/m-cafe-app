// Original file: src/protos/auth.proto

import type { Long } from '@grpc/proto-loader';

export interface AuthRequest {
  'id'?: (number | string | Long);
  'lookupHash'?: (string);
  'password'?: (string);
  'ttl'?: (string);
}

export interface AuthRequest__Output {
  'id'?: (string);
  'lookupHash'?: (string);
  'password'?: (string);
  'ttl'?: (string);
}

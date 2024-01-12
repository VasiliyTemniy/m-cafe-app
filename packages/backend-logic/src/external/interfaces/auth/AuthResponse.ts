// Original file: src/protos/auth.proto

import type { Long } from '@grpc/proto-loader';

export interface AuthResponse {
  'id'?: (number | string | Long);
  'token'?: (string);
  'error'?: (string);
}

export interface AuthResponse__Output {
  'id'?: (string);
  'token'?: (string);
  'error'?: (string);
}

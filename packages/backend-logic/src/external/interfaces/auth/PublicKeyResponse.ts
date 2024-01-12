// Original file: src/protos/auth.proto


export interface PublicKeyResponse {
  'publicKey'?: (Buffer | Uint8Array | string);
  'error'?: (string);
}

export interface PublicKeyResponse__Output {
  'publicKey'?: (Buffer);
  'error'?: (string);
}

export enum ApiRequestReason {
  Auth = 0,
  Payment = 1,
  DeliveryCalculation = 2,
  // TODO: Add more request reasons
}

export const isApiRequestReason = (type: unknown): type is ApiRequestReason => 
  (typeof type === 'number' || typeof type === 'string') && (type in ApiRequestReason);


export enum ApiRequestMethod {
  GET = 0,
  POST = 1,
  PUT = 2,
  PATCH = 3,
  DELETE = 4,
}

export const isApiRequestMethod = (type: unknown): type is ApiRequestMethod =>
  (typeof type === 'number' || typeof type === 'string') &&
  (type in ApiRequestMethod);


export enum ApiRequestExpectedResponseDataPlacementKey {
  Body = 0,
  Data = 1,
  Meta = 2,
  Links = 3,
}

export const isApiRequestExpectedResponseDataPlacementKey = (
  type: unknown
): type is ApiRequestExpectedResponseDataPlacementKey =>
  (typeof type === 'number' || typeof type === 'string') &&
  (type in ApiRequestExpectedResponseDataPlacementKey);


export enum ApiRequestExpectedResponseDataType {
  Json = 0,
  Text = 1,
  Xml = 2,
  Html = 3,
  Raw = 4,
  Binary = 5,
  File = 6,
  Array = 7,
  Multipart = 8,
}

export const isApiRequestExpectedResponseDataType = (
  type: unknown
): type is ApiRequestExpectedResponseDataType =>
  (typeof type === 'number' || typeof type === 'string') &&
  (type in ApiRequestExpectedResponseDataType);


export enum ApiRequestProtocol {
  Http = 0,
  Https = 1,
  Grpc = 2,
  Grpcs = 3,
  Ws = 4,
  Wss = 5,
  Ftp = 6,
  Ftps = 7,
  File = 8,
  Sftp = 9,
  Git = 10,
  GitSsh = 11,
}

export const isApiRequestProtocol = (
  type: unknown
): type is ApiRequestProtocol =>
  (typeof type === 'number' || typeof type === 'string') &&
  (type in ApiRequestProtocol);


export enum ApiRequestTokenPlacement {
  Header = 0,
  Query = 1,
  Body = 2
}

export const isApiRequestTokenPlacement = (
  type: unknown
): type is ApiRequestTokenPlacement =>
  (typeof type === 'number' || typeof type === 'string') &&
  (type in ApiRequestTokenPlacement);
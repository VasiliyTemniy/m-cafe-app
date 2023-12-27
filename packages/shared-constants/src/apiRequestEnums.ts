export enum ApiRequestReason {
  Auth = 'auth',
  Payment = 'payment',
  DeliveryCalculation = 'deliveryCalculation',
  // TODO: Add more request reasons
}

export const ApiRequestReasonNumericMapping = {
  [ApiRequestReason.Auth]: 0,
  [ApiRequestReason.Payment]: 1,
  [ApiRequestReason.DeliveryCalculation]: 2,
};

export const NumericToApiRequestReasonMapping: { [key: number]: ApiRequestReason } = {};
Object.values(ApiRequestReason).forEach((value) => {
  NumericToApiRequestReasonMapping[ApiRequestReasonNumericMapping[value]] = value;
});

export const isApiRequestReason = (type: unknown): type is ApiRequestReason => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ApiRequestReason).includes(type as ApiRequestReason);
};


export enum ApiRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export const ApiRequestMethodNumericMapping = {
  [ApiRequestMethod.GET]: 0,
  [ApiRequestMethod.POST]: 1,
  [ApiRequestMethod.PUT]: 2,
  [ApiRequestMethod.PATCH]: 3,
  [ApiRequestMethod.DELETE]: 4,
};

export const NumericToApiRequestMethodMapping: { [key: number]: ApiRequestMethod } = {};
Object.values(ApiRequestMethod).forEach((value) => {
  NumericToApiRequestMethodMapping[ApiRequestMethodNumericMapping[value]] = value;
});

export const isApiRequestMethod = (type: unknown): type is ApiRequestMethod => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ApiRequestMethod).includes(type as ApiRequestMethod);
};


export enum ApiRequestExpectedResponseDataPlacementKey {
  Body = 'body',
  Data = 'data',
  Meta = 'meta',
  Links = 'links',
}

export const ApiRequestExpectedResponseDataPlacementKeyNumericMapping = {
  [ApiRequestExpectedResponseDataPlacementKey.Body]: 0,
  [ApiRequestExpectedResponseDataPlacementKey.Data]: 1,
  [ApiRequestExpectedResponseDataPlacementKey.Meta]: 2,
  [ApiRequestExpectedResponseDataPlacementKey.Links]: 3,
};

export const NumericToApiRequestExpectedResponseDataPlacementKeyMapping:
  { [key: number]: ApiRequestExpectedResponseDataPlacementKey } = {};
Object.values(ApiRequestExpectedResponseDataPlacementKey).forEach((value) => {
  NumericToApiRequestExpectedResponseDataPlacementKeyMapping[
    ApiRequestExpectedResponseDataPlacementKeyNumericMapping[value]
  ] = value;
});

export const isApiRequestExpectedResponseDataPlacementKey = (
  type: unknown
): type is ApiRequestExpectedResponseDataPlacementKey => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ApiRequestExpectedResponseDataPlacementKey).includes(
    type as ApiRequestExpectedResponseDataPlacementKey
  );
};


export enum ApiRequestExpectedResponseDataType {
  Json = 'json',
  Text = 'text',
  Xml = 'xml',
  Html = 'html',
  Raw = 'raw',
  Binary = 'binary',
  File = 'file',
  Array = 'array',
  Multipart = 'multipart',
}

export const ApiRequestExpectedResponseDataTypeNumericMapping = {
  [ApiRequestExpectedResponseDataType.Json]: 0,
  [ApiRequestExpectedResponseDataType.Text]: 1,
  [ApiRequestExpectedResponseDataType.Xml]: 2,
  [ApiRequestExpectedResponseDataType.Html]: 3,
  [ApiRequestExpectedResponseDataType.Raw]: 4,
  [ApiRequestExpectedResponseDataType.Binary]: 5,
  [ApiRequestExpectedResponseDataType.File]: 6,
  [ApiRequestExpectedResponseDataType.Array]: 7,
  [ApiRequestExpectedResponseDataType.Multipart]: 8,
};

export const NumericToApiRequestExpectedResponseDataTypeMapping: {
  [key: number]: ApiRequestExpectedResponseDataType
} = {};
Object.values(ApiRequestExpectedResponseDataType).forEach((value) => {
  NumericToApiRequestExpectedResponseDataTypeMapping[
    ApiRequestExpectedResponseDataTypeNumericMapping[value]
  ] = value;
});

export const isApiRequestExpectedResponseDataType = (
  type: unknown
): type is ApiRequestExpectedResponseDataType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ApiRequestExpectedResponseDataType).includes(
    type as ApiRequestExpectedResponseDataType
  );
};


export enum ApiRequestProtocol {
  Http = 'http:',
  Https = 'https:',
  Grpc = 'grpc:',
  Grpcs = 'grpcs:',
  Ws = 'ws:',
  Wss = 'wss:',
  Ftp = 'ftp:',
  Ftps = 'ftps:',
  File = 'file:',
  Sftp = 'sftp:',
  Git = 'git:',
  GitSsh = 'git+ssh:',
}

export const ApiRequestProtocolNumericMapping = {
  [ApiRequestProtocol.Http]: 0,
  [ApiRequestProtocol.Https]: 1,
  [ApiRequestProtocol.Grpc]: 2,
  [ApiRequestProtocol.Grpcs]: 3,
  [ApiRequestProtocol.Ws]: 4,
  [ApiRequestProtocol.Wss]: 5,
  [ApiRequestProtocol.Ftp]: 6,
  [ApiRequestProtocol.Ftps]: 7,
  [ApiRequestProtocol.File]: 8,
  [ApiRequestProtocol.Sftp]: 9,
  [ApiRequestProtocol.Git]: 10,
  [ApiRequestProtocol.GitSsh]: 11,
};

export const NumericToApiRequestProtocolMapping: {
  [key: number]: ApiRequestProtocol
} = {};
Object.values(ApiRequestProtocol).forEach((value) => {
  NumericToApiRequestProtocolMapping[ApiRequestProtocolNumericMapping[value]] = value;
});

export const isApiRequestProtocol = (
  type: unknown
): type is ApiRequestProtocol => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ApiRequestProtocol).includes(
    type as ApiRequestProtocol
  );
};


export enum ApiRequestTokenPlacement {
  Header = 'header',
  Query = 'query',
  Body = 'body'
}

export const ApiRequestTokenPlacementNumericMapping = {
  [ApiRequestTokenPlacement.Header]: 0,
  [ApiRequestTokenPlacement.Query]: 1,
  [ApiRequestTokenPlacement.Body]: 2
};

export const NumericToApiRequestTokenPlacementMapping: {
  [key: number]: ApiRequestTokenPlacement
} = {};
Object.values(ApiRequestTokenPlacement).forEach((value) => {
  NumericToApiRequestTokenPlacementMapping[ApiRequestTokenPlacementNumericMapping[value]] = value;
});

export const isApiRequestTokenPlacement = (
  type: unknown
): type is ApiRequestTokenPlacement => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ApiRequestTokenPlacement).includes(
    type as ApiRequestTokenPlacement
  );
};
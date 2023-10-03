export interface EntityDBMapper<DomainEntity, DBEntity> {
  dbToDomain(instance: DBEntity): DomainEntity;
  domainToDb(instance: DomainEntity): DBEntity;
}

export interface EntityInmemMapper<DomainEntity, InmemEntity> {
  inmemToDomain(instance: InmemEntity): DomainEntity;
  domainToInmem(instance: DomainEntity): InmemEntity;
}

export interface EntityHttpMapper<DomainEntity, HttpEntity> {
  httpToDomain(instance: HttpEntity): DomainEntity;
  domainToHttp(instance: DomainEntity): HttpEntity;
}
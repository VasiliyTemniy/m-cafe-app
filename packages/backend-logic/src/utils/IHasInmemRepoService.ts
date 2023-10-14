export interface IHasInmemRepoService {
  flushInmem(): Promise<void>;
  connectInmem(): Promise<void>;
  pingInmem(): Promise<void>;
  closeInmem(): Promise<void>;
}
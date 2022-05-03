export interface Service<P, T> {
  (params: P, signal: AbortSignal): Promise<T>;
}

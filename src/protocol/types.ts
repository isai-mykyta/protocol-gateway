export enum OcppMessageType {
  CALL = 2,
  RESULT = 3,
  ERROR = 4,
}

export type CallMessage<A = unknown, P = unknown> = [OcppMessageType.CALL, string, A, P];
export type CallResultMessage<P = unknown> = [OcppMessageType.RESULT, string, P];
export type CallErrorMessage<E = unknown> = [OcppMessageType.ERROR, string, E, string, string];

export type OcppMessage<A = unknown, P = unknown, E = unknown> =
  | CallMessage<A, P>
  | CallResultMessage<P>
  | CallErrorMessage<E>;

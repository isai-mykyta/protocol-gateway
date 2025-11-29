export enum OcppProtocol {
  OCPP16 = "ocpp1.6",
  OCPP20 = "ocpp2.0",
  OCPP201 = "ocpp2.0.1",
  OCPP21 = "ocpp2.1"
}

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

export type CsMessageReceivedPayload = {
  message: string;
  identity: string;
  ipAddress: string;
  protocol: string;
  timestamp: number;
}

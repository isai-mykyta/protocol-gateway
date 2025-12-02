import { logger } from "@mykyta-isai/logger";

import { Ocpp16Service } from "./ocpp16";
import { Ocpp2Service } from "./ocpp2";
import { CsMessageReceivedPayload, OcppProtocol } from "./types";

export class ProtocolService {
  private readonly ocpp16Protocol = new Ocpp16Service();
  private readonly ocpp2Protocol = new Ocpp2Service();

  private validateCsMessage(payload: CsMessageReceivedPayload): boolean {
    const { message, identity, ipAddress, protocol, timestamp } = payload;

    const isValidMessage = !!message && typeof message === "string";
    const isValidIdentity = !!identity && typeof identity === "string";
    const isValidIpAddress = !!ipAddress && typeof ipAddress === "string";
    const isValidProtocol = !!protocol && Object.values(OcppProtocol).includes(protocol as OcppProtocol);
    const isValidTimestamp = !!timestamp && typeof timestamp === "number";

    return isValidMessage && isValidIdentity && isValidIpAddress && isValidProtocol && isValidTimestamp;
  }

  public async handleCsMessage(payload: CsMessageReceivedPayload): Promise<void> {
    logger.info(`CS message received: ${JSON.stringify(payload)}`);

    if (!this.validateCsMessage(payload)) {
      logger.error(`Invalid CS message: ${JSON.stringify(payload)}`);
      return;
    }

    switch (payload.protocol) {
    case OcppProtocol.OCPP16:
      await this.ocpp16Protocol.handleOcppMessage(payload);
      return;
    case OcppProtocol.OCPP20:
    case OcppProtocol.OCPP201:
    case OcppProtocol.OCPP21:
      await this.ocpp2Protocol.handleOcppMessage(payload);
      return;
    default:
      logger.error(`Recieved message with invalid protocol`);
      return;
    }
  }
}

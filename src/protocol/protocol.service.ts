import { logger } from "@mykyta-isai/logger";

import { Ocpp16Service } from "./ocpp16";
import { Ocpp2Service } from "./ocpp2";
import { CsMessageReceivedPayload, OcppProtocol } from "./types";
import { validateDto } from "../utils";
import { CsMessageDto } from "./dtos";

export class ProtocolService {
  private readonly ocpp16Protocol = new Ocpp16Service();
  private readonly ocpp2Protocol = new Ocpp2Service();

  public async handleCsMessage(payload: string): Promise<void> {
    let parsedMessage: CsMessageReceivedPayload;
    
    try {
      parsedMessage = JSON.parse(payload);
    } catch {
      logger.error(`Failed to parse CS message payload`);
      return;
    }
    
    logger.info(`CS message received: ${JSON.stringify(parsedMessage)}`);
    const { isValid: isMessageValid, errors } = validateDto(parsedMessage, CsMessageDto);

    if (!isMessageValid) {
      logger.error(`Invalid CS message: ${JSON.stringify(errors)}`);
      return;
    }

    switch (parsedMessage.protocol) {
    case OcppProtocol.OCPP16:
      await this.ocpp16Protocol.handleOcppMessage(parsedMessage);
      return;
    case OcppProtocol.OCPP20:
    case OcppProtocol.OCPP201:
    case OcppProtocol.OCPP21:
      await this.ocpp2Protocol.handleOcppMessage(parsedMessage);
      return;
    default:
      logger.error(`Recieved message with invalid protocol`);
      return;
    }
  }
}

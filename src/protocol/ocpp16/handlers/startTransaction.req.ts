import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { OcppMessageAction, StartTransactionReq } from "../types";

export const handleStartTransactionReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.START_TRANSACTION, StartTransactionReq> }
): Promise<void> => {};

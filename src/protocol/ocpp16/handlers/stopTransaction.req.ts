import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { OcppMessageAction, StopTransactionReq } from "../types";

export const handleStopTransactionReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.STOP_TRANSACTION, StopTransactionReq> }
): Promise<void> => {};

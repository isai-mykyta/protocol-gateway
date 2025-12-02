import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { 
  AuthorizationStatus,
  OcppMessageAction, 
  StopTransactionConf, 
  StopTransactionReq 
} from "../types";

export const handleStopTransactionReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.STOP_TRANSACTION, StopTransactionReq> }
): Promise<StopTransactionConf> => {
  return {
    idTagInfo: {
      expiryDate: new Date().toISOString(),
      parentIdTag: "mock-id-tag",
      status: AuthorizationStatus.ACCEPTED,
    }
  };
};

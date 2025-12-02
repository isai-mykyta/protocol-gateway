import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { 
  AuthorizationStatus,
  OcppMessageAction, 
  StartTransactionConf, 
  StartTransactionReq 
} from "../types";

export const handleStartTransactionReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.START_TRANSACTION, StartTransactionReq> }
): Promise<StartTransactionConf> => {
  return {
    idTagInfo: {
      expiryDate: new Date().toISOString(),
      parentIdTag: "mock-id-tag",
      status: AuthorizationStatus.ACCEPTED,
    },
    transactionId: 1,
  };
};

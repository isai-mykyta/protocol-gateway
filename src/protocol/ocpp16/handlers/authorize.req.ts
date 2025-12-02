import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { 
  AuthorizationStatus, 
  AuthorizeConf, 
  AuthorizeReq, 
  OcppMessageAction 
} from "../types";

export const handleAuthorizeReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.AUTHORIZE, AuthorizeReq> }
): Promise<AuthorizeConf> => {
  return {
    idTagInfo: {
      expiryDate: new Date().toISOString(),
      parentIdTag: "mock-id-tag",
      status: AuthorizationStatus.ACCEPTED,
    }
  };
};

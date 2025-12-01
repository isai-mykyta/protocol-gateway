import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { AuthorizeReq, OcppMessageAction } from "../types";

export const handleAuthorizeReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.AUTHORIZE, AuthorizeReq> }
): Promise<void> => {};

import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { OcppMessageAction, StatusNotificationReq } from "../types";

export const handleStatusNotificationReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.STATUS_NOTIFICATION, StatusNotificationReq> }
): Promise<void> => {};

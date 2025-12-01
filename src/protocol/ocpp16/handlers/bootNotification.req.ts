import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { BootNotificationReq, OcppMessageAction } from "../types";

export const handleBootNotificationReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.BOOT_NOTIFICATION, BootNotificationReq> }
): Promise<void> => {};

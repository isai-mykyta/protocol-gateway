import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { 
  BootNotificationConf,
  BootNotificationReq, 
  OcppMessageAction, 
  RegistrationStatus
} from "../types";

export const handleBootNotificationReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.BOOT_NOTIFICATION, BootNotificationReq> }
): Promise<BootNotificationConf> => {
  return {
    currentTime: new Date().toISOString(),
    interval: 60_000,
    status: RegistrationStatus.ACCEPTED
  };
};

import { CallResultMessage, CsMessageReceivedPayload } from "../../types";
import { ResetConf } from "../types";

export const handleResetConf = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallResultMessage<ResetConf> }
): Promise<void> => {};

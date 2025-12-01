import { CallResultMessage, CsMessageReceivedPayload } from "../../types";
import { ChangeConfigurationConf } from "../types";

export const handleChangeConfigurationConf = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallResultMessage<ChangeConfigurationConf> }
): Promise<void> => {};

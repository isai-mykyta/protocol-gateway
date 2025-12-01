import { CallResultMessage, CsMessageReceivedPayload } from "../../types";
import { GetConfigurationConf } from "../types";

export const handleGetConfigurationConf = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallResultMessage<GetConfigurationConf> }
): Promise<void> => {};

import { CallMessage, CsMessageReceivedPayload } from "../../types";
import { 
  MeterValuesConf, 
  MeterValuesReq, 
  OcppMessageAction 
} from "../types";

export const handleMeterValuesReq = async (
  data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction.METER_VALUES, MeterValuesReq> }
): Promise<MeterValuesConf> => {
  return {};
};

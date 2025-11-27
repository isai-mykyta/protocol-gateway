import { Ocpp16Service } from "./ocpp16";
import { Ocpp2Service } from "./ocpp2";

export class ProtocolService {
  private readonly ocpp16Protocol = new Ocpp16Service();
  private readonly ocpp2Protocol = new Ocpp2Service();

  public handleCsMessage() {}
}

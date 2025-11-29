import { IsEnum, IsNotEmpty } from "class-validator";

import { ConfigurationStatus } from "../types";

export class ChangeConfigurationConfDto {
  @IsNotEmpty()
  @IsEnum(ConfigurationStatus)
  public status: ConfigurationStatus;
}

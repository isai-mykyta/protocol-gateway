import { IsEnum, IsNotEmpty } from "class-validator";

import { ResetStatus } from "../types";

export class ResetConfDto {
  @IsNotEmpty()
  @IsEnum(ResetStatus)
  public status: ResetStatus;
}

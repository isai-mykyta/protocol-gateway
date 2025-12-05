import { IsEnum, IsNotEmpty } from "class-validator";

import { ResetType } from "../../../protocol";

export class ResetReqDto {
  @IsNotEmpty()
  @IsEnum(ResetType)
  public type: ResetType;
}

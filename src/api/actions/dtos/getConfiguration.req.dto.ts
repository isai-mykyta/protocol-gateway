import { IsOptional, IsString } from "class-validator";

export class GetConfigurationReqDto {
  @IsOptional()
  @IsString({ each: true })
  public key?: string[];
}

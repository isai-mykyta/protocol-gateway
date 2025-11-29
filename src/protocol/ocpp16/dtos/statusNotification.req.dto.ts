import { 
  IsEnum,
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MaxLength, 
  Min 
} from "class-validator";

import { ChargePointErrorCode, ChargePointStatus } from "../types";

export class StatusNotificationReqDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  public connectorId: number;

  @IsNotEmpty()
  @IsEnum(ChargePointErrorCode)
  public errorCode: ChargePointErrorCode;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public info?: string;

  @IsNotEmpty()
  @IsEnum(ChargePointStatus)
  public status: ChargePointStatus;

  @IsOptional()
  @IsString()
  public timestamp?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  public vendorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public vendorErrorCode?: string;
}

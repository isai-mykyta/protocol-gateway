import { Type } from "class-transformer";
import { 
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional, 
  IsPositive, 
  IsString,
  MaxLength,
  ValidateNested
} from "class-validator";

import { Reason } from "../types";
import { MeterValueDto } from "./meterValues.req.dto";

export class StopTransactionReqDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  public idTag?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public meterStop: number;

  @IsNotEmpty()
  @IsString()
  public timestamp: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public transactionId: number;

  @IsOptional()
  @IsEnum(Reason)
  public reason?: Reason;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MeterValueDto)
  public transactionData?: MeterValueDto;
}

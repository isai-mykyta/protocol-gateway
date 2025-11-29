import { Type } from "class-transformer";
import { 
  IsArray,
  IsEnum,
  IsInt, 
  IsNotEmpty, 
  IsNumber, 
  IsObject, 
  IsOptional, 
  IsPositive, 
  IsString, 
  Min, 
  ValidateNested
} from "class-validator";

import { 
  Measurand, 
  Phase, 
  ReadingContext, 
  UnitOfMeasure, 
  ValueFormat 
} from "../types";

export class MeterValuesReqDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  public connectorId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  public transactionId?: number;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => MeterValueDto)
  public meterValue: MeterValueDto;
}

export class MeterValueDto {
  @IsNotEmpty()
  @IsString()
  public timestamp: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SampledValueDto)
  public sampledValue: SampledValueDto[];
}

export class SampledValueDto {
  @IsNotEmpty()
  @IsString()
  public value: string;

  @IsOptional()
  @IsEnum(ReadingContext)
  public context?: ReadingContext;

  @IsOptional()
  @IsEnum(ValueFormat)
  public format?: ValueFormat;

  @IsOptional()
  @IsEnum(Measurand)
  public measurand?: Measurand;

  @IsOptional()
  @IsEnum(Phase)
  public phase?: Phase;

  @IsOptional()
  @IsEnum(Location)
  public location?: Location;

  @IsOptional()
  @IsEnum(UnitOfMeasure)
  public unit?: UnitOfMeasure;
}

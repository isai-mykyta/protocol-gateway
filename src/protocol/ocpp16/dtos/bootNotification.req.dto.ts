import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MaxLength 
} from "class-validator";

export class BootNotificationReqDto {
  @IsOptional()
  @IsString()
  @MaxLength(25)
  public chargeBoxSerialNumber?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  public chargePointModel: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  public chargePointSerialNumber?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  public chargePointVendor: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public firmwareVersion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  public iccid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  public imsi?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  public meterSerialNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  public meterType?: string;
}

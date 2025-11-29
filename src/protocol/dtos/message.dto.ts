import { IsEnum, IsNotEmpty, IsNumber, IsString, IsInt } from "class-validator";

import { OcppProtocol } from "../types";

export class CsMessageDto {
  @IsNotEmpty()
  @IsString()
  public message: string;
  
  @IsNotEmpty()
  @IsString()
  public identity: string;

  @IsNotEmpty()
  @IsString()
  public ipAddress: string;

  @IsNotEmpty()
  @IsEnum(OcppProtocol)
  public protocol: string;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  public timestamp: number;
}

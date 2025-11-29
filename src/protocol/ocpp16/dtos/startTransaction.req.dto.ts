import { 
  IsInt, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsString, 
  MaxLength, 
  Min 
} from "class-validator";

export class StartTransactionReqDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  public connectorId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  public idTag: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public meterStart: number;

  @IsOptional()
  @IsInt()
  public reservationId?: number;

  @IsNotEmpty()
  @IsString()
  public timestamp: string;
}

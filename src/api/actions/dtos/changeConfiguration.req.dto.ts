import { 
  IsNotEmpty, 
  IsString, 
  MaxLength 
} from "class-validator";

export class ChangeConfigurationReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  public key: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  public value: string;
}

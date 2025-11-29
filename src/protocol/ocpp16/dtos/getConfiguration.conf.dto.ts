import { Type } from "class-transformer";
import { 
  IsArray,
  IsBoolean, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MaxLength, 
  ValidateNested 
} from "class-validator";

export class GetConfigurationConfDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyValueDto)
  public key: KeyValueDto[];

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public unknownKey?: string;
}

export class KeyValueDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  public key: string;

  @IsNotEmpty()
  @IsBoolean()
  public readonly: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  public value?: string;
}

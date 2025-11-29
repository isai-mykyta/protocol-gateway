import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AuthorizeReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  public idTag: string;
}

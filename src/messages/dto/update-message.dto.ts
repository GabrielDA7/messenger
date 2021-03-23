import {IsIn, IsOptional, IsString} from "class-validator";
import {Type} from "../enums/type.enum";

export class UpdateMessageDto {
    @IsOptional()
    @IsString()
    @IsIn([Type.EMAIL, Type.SMS])
    type: string

    @IsOptional()
    @IsString()
    readonly message: string
}

import {IsIn, IsString} from "class-validator";
import {Type} from "../enums/type.enum";

export class AnswerMessageDto {
    @IsString()
    @IsIn([Type.EMAIL, Type.SMS])
    type: string

    @IsString()
    readonly message: string
}

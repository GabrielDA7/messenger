import {IsIn, IsInt, IsString} from "class-validator";
import {Type} from "../enums/type.enum";

export class SendDto {
    @IsString()
    @IsIn([Type.EMAIL, Type.SMS])
    type: string

    @IsString()
    readonly message: string

    @IsInt()
    readonly recipientId: number
}

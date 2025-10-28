import { IsString } from "class-validator";

export class CreateListDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;
}

import { IsString, IsArray, IsOptional } from "class-validator";

export class CreateListDto {
    // @IsString()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsString()
    @IsOptional()
    userId?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    readonly vocabulary?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    readonly expressions?: string[];
}
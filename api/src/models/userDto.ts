import { ApiProperty } from "@nestjs/swagger";
import { PostDto } from "./post";

export class UserDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    name?: string;

    @ApiProperty()
    posts?: PostDto[];
}
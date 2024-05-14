import { ApiProperty } from "@nestjs/swagger";

export class User implements User {
	@ApiProperty()
	id: number;

	@ApiProperty()
	username: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	avaUrl: string;
}

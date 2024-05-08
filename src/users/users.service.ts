import { Injectable } from "@nestjs/common";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	create(createUserDto: CreateUserDto) {
		return "This action adds a new user";
	}

	findAll() {
		return this.prisma.user.findMany();
	}

	findOne(id: number) {
		return `This action returns a #${id} user`;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}

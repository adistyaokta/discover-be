import { Injectable } from "@nestjs/common";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	create(data: CreateUserDto) {
		return this.prisma.user.create({ data });
	}

	findAll() {
		return this.prisma.user.findMany();
	}

	findOne(id: number) {
		return this.prisma.user.findUnique({ where: { id } });
	}

	update(id: number, data: UpdateUserDto) {
		return this.prisma.user.update({ where: { id }, data });
	}

	remove(id: number) {
		return this.prisma.user.delete({ where: { id } });
	}
}

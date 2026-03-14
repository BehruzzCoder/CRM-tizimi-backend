import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async findByLogin(login: string) {
    return await this.userRepo.findOne({
      where: { login },
    });
  }

  async findById(id: number) {
    return await this.userRepo.findOne({
      where: { id },
    });
  }

  async findAll() {
    return await this.userRepo.find({
      order: { createdAt: "DESC" },
    });
  }

  async create(dto: CreateUserDto) {
    const existingLogin = await this.userRepo.findOne({
      where: { login: dto.login },
    });

    if (existingLogin) {
      throw new ConflictException("Bu login allaqachon mavjud");
    }

    const existingPhone = await this.userRepo.findOne({
      where: { phone: dto.phone },
    });

    if (existingPhone) {
      throw new ConflictException("Bu telefon allaqachon mavjud");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      fullName: dto.fullName,
      phone: dto.phone,
      login: dto.login,
      password: hashedPassword,
      role: dto.role,
      image: dto.image || null,
      isActive: dto.isActive ?? true,
      customStartTime: dto.customStartTime || null,
    });

    return await this.userRepo.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException("User topilmadi");
    }

    if (dto.login && dto.login !== user.login) {
      const existingLogin = await this.userRepo.findOne({
        where: { login: dto.login },
      });

      if (existingLogin) {
        throw new ConflictException("Bu login allaqachon mavjud");
      }
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existingPhone = await this.userRepo.findOne({
        where: { phone: dto.phone },
      });

      if (existingPhone) {
        throw new ConflictException("Bu telefon allaqachon mavjud");
      }
    }

    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.login !== undefined) user.login = dto.login;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.image !== undefined) user.image = dto.image ?? null;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.customStartTime !== undefined) {
      user.customStartTime = dto.customStartTime ?? null;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException("User topilmadi");
    }

    await this.userRepo.delete(id);

    return {
      message: "User o‘chirildi",
      data: user,
    };
  }

  async me(userId: number) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException("User topilmadi");
    }

    return user;
  }
}
import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { UserRole } from "../users/entities/user-role.enum";

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async onModuleInit() {
    const admin = await this.usersService.findByLogin("admin");

    const defaultPassword = "buyukzamon2022";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    if (!admin) {
      await this.usersService.create({
        fullName: "Admin",
        phone: "+998900000000",
        login: "admin",
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      });
    }
  }

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findByLogin(login);

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Login yoki parol noto‘g‘ri");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException("Login yoki parol noto‘g‘ri");
    }

    return user;
  }

  async login(login: string, password: string) {
    const user = await this.validateUser(login, password);

    const payload = {
      sub: user.id,
      login: user.login,
      role: user.role,
    };

    return {
      message: "Muvaffaqiyatli login bo‘ldi",
      token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        login: user.login,
        role: user.role,
      },
    };
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    if (!createdUser) {
      return { message: 'User creation failed' };
    }

    return new ResponseUserDto(createdUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const users = await this.usersService.findAll(
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined,
    );

    return {
      ...users,
      data: users.data.map((user) => {
        const { passwordHash, ...safeUser } = user;
        void passwordHash;
        return safeUser;
      }),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      return { message: 'User not found' };
    }

    return new ResponseUserDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      return { message: 'User update failed' };
    }

    return new ResponseUserDto(updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors , UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; 
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
      return this.authService.loginUser(loginUserDto);
  }

  
  // teacher 
  @Post('uploadStudents/:id')
  @Auth(ValidRoles.teacher)
  @UseInterceptors(FileInterceptor('file', {storage: memoryStorage(), }))
  uploadFile(@Param('id') id: string ,@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const data = this.authService.readExcel(file.buffer, id);
    return { message: 'uploaded and processed', data };
  }

}

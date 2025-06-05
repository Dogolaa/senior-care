import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllUsersQuery } from 'src/application/query/user/getAllUsers.query';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(_query: GetAllUsersQuery): Promise<User[]> {
    try {
      return await this.userRepository.find({
        select: ['name', 'email', 'phone', 'isActive'],
        relations: ['address', 'role'],
      });
    } catch (error) {
      throw new BadRequestException('Erro ao buscar usuários');
    }
  }
}

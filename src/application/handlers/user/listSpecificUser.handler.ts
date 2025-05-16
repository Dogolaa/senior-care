import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ListSpecificUserQuery } from 'src/application/query/user/listSpecificUser.query';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

@QueryHandler(ListSpecificUserQuery)
export class ListSpecificUserHandler
  implements IQueryHandler<ListSpecificUserQuery>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: ListSpecificUserQuery): Promise<User[]> {
    const email = query.email;

    try {
      return await this.userRepository.find({
        select: ['name', 'email', 'phone', 'isActive'],
        relations: ['address', 'role'],
        where: [{ email }],
      });
    } catch {
      throw new BadRequestException('Erro ao buscar usuários');
    }
  }
}

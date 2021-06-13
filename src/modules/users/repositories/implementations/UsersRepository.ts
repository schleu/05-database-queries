import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({user_id,}: IFindUserWithGamesDTO): Promise<User> {
    const user =  await this.repository
    .createQueryBuilder('user')
    .select(["user.email","user.first_name","user.last_name","game.title"])
    .leftJoin("user.games","game")
    .where({ id: user_id })
    .getOne()

    if(!user)throw('User not exits!')

    return user

  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`select * from users order by users.first_name`);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
      ` SELECT
          first_name,
          last_name,
          email
        FROM users
        WHERE
        LOWER("first_name") = LOWER('${first_name}')
        AND LOWER("last_name") =  LOWER('${last_name}')
      `
    );
  }
}

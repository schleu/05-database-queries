import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
    .createQueryBuilder("game")
    .select(["game.title"])
    .where("LOWER(game.title) like LOWER(:title)",{title:'%'+param+'%'})
    .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`select count(*) from games`);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
    .createQueryBuilder("game")
    .select(["game.id","user.first_name","user.last_name","user.email"])
    .innerJoin("game.users", "user")
    .where({id})
    .getOne();

    if(!game)throw('Id not found!')
    
    const users = game.users;

    return users;
  }
}

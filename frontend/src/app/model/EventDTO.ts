import { Difficulty } from './Difficulty';
import { UserDTO } from './UserDTO';

export interface EventDTO {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string;
  difficulty: Difficulty;
  host: UserDTO;
  spots: number;
  eventImageUrl: string;
  participants: UserDTO[];
}

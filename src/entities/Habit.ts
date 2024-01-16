import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { HabitLog } from "./HabitLog";

@Entity()
export class Habit {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 100 })
  name?: string;

  @Column({ length: 50 })
  description?: string;

  @Column()
  frequency?: number;

  @Column({ default: 0 })
  monthlyOccurrences?: number;

  @Column({ default: 0 })
  totalOccurrences?: number;

  @ManyToOne(() => User, (user) => user.habits)
  user?: User;

  @OneToMany(() => HabitLog, (habitLog) => habitLog.habit)
  habitLogs?: HabitLog[];
}

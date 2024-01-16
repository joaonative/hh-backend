import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Habit } from "./Habit";

@Entity()
export class HabitLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp?: Date;

  @Column()
  monthlyOccurrences?: number;

  @ManyToOne(() => User, (user) => user.habitLogs)
  user?: User;

  @ManyToOne(() => Habit, (habit) => habit.habitLogs)
  habit?: Habit;
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Habit } from "./Habit";
import { HabitLog } from "./HabitLog";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 50 })
  name?: string;

  @Column({ length: 255 })
  email?: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @OneToMany(() => Habit, (habit) => habit.user)
  habits?: Habit[];

  @OneToMany(() => HabitLog, (habitLog) => habitLog.user)
  habitLogs?: HabitLog[];
}

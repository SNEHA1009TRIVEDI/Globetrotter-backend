import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string; // Hashed password

  @Column({ default: 0 })
  correctAttempts: number; // User's total score

  @Column({ default: 0 })
  incorrectAttempts: number;

  @Column({ default: 0 })
  totalAttempts: number;

  @Column({ default: false })
  isGuestUser: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Teachers, Students } from '.';

@Entity('Intersection', { schema: 'school' })
export class Intersection {
  @Column('int', {
    primary: true,
    name: 'id',
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Teachers, teacher => teacher.id)
  @JoinColumn({ name: 'teacher_id' })
  public teacher: Teachers;

  @ManyToOne(type => Students, student => student.id)
  @JoinColumn({ name: 'student_id' })
  public student: Students;

  @Column('boolean', {
    nullable: false,
    default: true,
    name: 'status',
  })
  public status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  public updatedAt: Date;
}

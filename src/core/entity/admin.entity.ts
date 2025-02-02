import { Column, Entity } from 'typeorm';
import { BaseEntity, RoleAdmin } from '../../common';

@Entity('admins')
export class AdminEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'username', unique: true })
  username: string;

  @Column({ type: 'varchar', name: 'hashed_password' })
  hashed_password: string;

  @Column({
    type: 'varchar',
    name: 'phone_number',
    unique: true,
    nullable: true,
  })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: RoleAdmin,
    default: RoleAdmin.ADMIN,
  })
  role: RoleAdmin;
}

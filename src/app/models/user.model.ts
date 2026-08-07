export type UserRole = 'User' | 'Admin';

export interface UserReadDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole | null;
  createdAt: string;
}

export interface UserCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
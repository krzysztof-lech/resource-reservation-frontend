export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface CreateReservationDto {
  resourceId: string;
  startTime: string;
  endTime: string;
}

export interface ReservationReadDto {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
}

export interface ReservationPublicReadDto {
  id: string;
  resourceId: string;
  resourceName: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
}
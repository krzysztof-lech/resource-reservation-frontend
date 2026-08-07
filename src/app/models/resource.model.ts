export interface ResourceReadDto {
  id: string;
  name: string;
  description: string | null;
  isAvailable: boolean;
  slotDurationMinutes: number;
  availableFrom: string; 
  availableTo: string;  
  allowedDays: number[]; 
  categoryId: number | null;
  categoryName: string | null;
}

export interface ResourceCreateDto {
  name: string;
  description?: string | null;
  isAvailable?: boolean;
  slotDurationMinutes?: number;
  availableFrom?: string;
  availableTo?: string;
  allowedDays?: number[];
  categoryId?: number | null;
}

export interface ResourceUpdateDto {
  name?: string;
  description?: string | null;
  isAvailable?: boolean;
  slotDurationMinutes?: number;
  availableFrom?: string;
  availableTo?: string;
  allowedDays?: number[];
  categoryId?: number | null;
}
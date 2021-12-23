export * from './booking.service';
import { BookingService } from './booking.service';
export * from './room.service';
import { RoomService } from './room.service';
export const APIS = [BookingService, RoomService];

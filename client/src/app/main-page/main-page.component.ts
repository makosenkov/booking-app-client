import {Component, OnInit} from '@angular/core';

import {BookingService, Room, RoomService} from "../generated";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  startDate!: Date;
  endDate!: Date;

  startDateAvailable!: Date;
  endDateAvailable!: Date;

  availableRooms: Room[] = [];
  allRooms: Room[] = [];

  selectedRoom: Room = {};
  selectedRoomAvailability: Room = {};

  isAvailable: boolean = false;
  isChecked: boolean = false;

  constructor(private roomService: RoomService,
              private bookingService: BookingService) {
  }

  ngOnInit(): void {
    this.roomService.findAll()
      .subscribe(data => this.allRooms = data);
  }

  datesAreValid(): boolean {
    if (this.startDate && this.endDate) {
      return this.startDate <= this.endDate;
    }
    return false;
  }

  findAvailableRooms() {
    this.roomService.findAllByDates(
      this.formatForRest(this.startDate),
      this.formatForRest(this.endDate))
      .subscribe(data => this.availableRooms = data);
  }

  formatForRest(date: Date): string {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
  }

  selectionChange(value: Room) {
    this.selectedRoom = value;
  }

  selectionChangeAvailability(value: Room) {
    this.selectedRoomAvailability = value;
    this.isChecked = false;
  }

  bookSelectedRoom() {
    const startDate = this.formatForRest(this.startDate);
    const endDate = this.formatForRest(this.endDate);
    this.bookingService.save(this.selectedRoom.id!, startDate, endDate)
      .subscribe(() => this.findAvailableRooms());
  }

  availabilityDatesAreValid() {
    if (this.startDateAvailable && this.endDateAvailable) {
      return this.startDateAvailable <= this.endDateAvailable;
    }
    return false;
  }

  roomIsAvailable() {
    this.roomService.isAvailable(
      this.selectedRoomAvailability.id!,
      this.formatForRest(this.startDateAvailable),
      this.formatForRest(this.endDateAvailable))
      .subscribe(data => {
        this.isAvailable = data;
        this.isChecked = true;
      });
  }
}

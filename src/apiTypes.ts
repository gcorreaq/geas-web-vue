export interface ApiAvailableSlots {
  locationId: number;
  startTimestamp: string;
  endTimestamp: string;
  active: boolean;
  duration: number;
  remoteInd: boolean;
}

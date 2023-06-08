type ApiLocationService = {
  id: number;
  name: string;
};

export type ApiLocation = {
  id: number;
  name: string;
  shortName: string;
  locationType: string;
  locationCode: string;
  address: string;
  addressAdditional: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  tzData: string;
  phoneNumber: string;
  phoneAreaCode: string;
  phoneCountryCode: string;
  phoneExtension: string;
  phoneAltNumber: string;
  phoneAltAreaCode: string;
  phoneAltCountryCode: string;
  phoneAltExtension: string;
  faxNumber: string;
  faxAreaCode: string;
  faxCountryCode: string;
  faxExtension: string;
  effectiveDate: string;
  temporary: boolean;
  inviteOnly: boolean;
  operational: boolean;
  directions: string;
  mapFileName: string;
  remoteInd: boolean;
  services: ApiLocationService[];
};

export type ApiAvailableSlots = {
  // # The ID of the location where the interview is available at
  locationId: number;
  // # Start time of the appointment (2023-12-19T10:30)
  startTimestamp: string;
  // # End time of the appointment (2023-12-19T10:45)
  endTimestamp: string;
  // # ???
  active: boolean;
  // # Duration of the appointment. Seems to be in minutes
  duration: number;
  // # ???
  remoteInd: boolean;
};

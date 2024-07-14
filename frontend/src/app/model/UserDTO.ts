export interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  dateOfBirth: string;
  state: string;
  zipcode: string;
  profilePictureUrl: string | null;
  hostedEventIds?: number[];
  participatedEventIds?: number[];
}

export interface IUserProfile {
  profilePicture?: string;
  FullName?: string;
  email?: string;
  contactPhone?: string | null;
  gender?: string;
  location?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  eductionBackground?: string;
  favoriteCards: string[];
}

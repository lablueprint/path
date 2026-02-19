export type UserRole = {
  user_role_id: string; // string corresponds to uuid
  user_id: string;
  role_id: number;
};
export type User = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_photo_url: string;
};

export type UserUpdate = Omit<User, 'user_id'>;

export type Me = {
  id: string;
  cognitoSub: string;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  profileSource?: "idp" | "user";
  createdAt?: string;
  updatedAt?: string;
};

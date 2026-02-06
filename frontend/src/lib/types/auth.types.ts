export type Gender = "MALE" | "FEMALE" | "OTHER";
export type PreferredLanguage = "ko" | "en" | "ja";

export type RegisterFormState = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  birth: string;
  gender: "" | Gender;
  preferredLanguage: "" | PreferredLanguage;
  timeZone: string;
  agreeTerms: boolean;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  nickname?: string;
  phoneNumber?: string;
  birth?: string; // YYYY-MM-DD
  gender?: Gender;
  preferredLanguage?: PreferredLanguage;
  timeZone?: string;
};

export type LoginFormState = {
  email: string;
  password: string;
}
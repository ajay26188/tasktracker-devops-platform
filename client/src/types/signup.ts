export interface SignupData {
    name: string, 
    email: string,
    password: string,
    organizationId: string
}

export interface VerifiedUser {
    name: string;
    email: string;
    isVerified: boolean;
    role: string;
  }
export interface SignInType {
    firstName: string;
    lastName: string;

    Rawpassword: string;
    refreshToken?: string; // not sure of ?
    birthDate: Date;
}
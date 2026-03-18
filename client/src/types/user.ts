
export interface User {
    id: string,
    name: string;
    email: string;
    role: "admin" | "member";
}

export interface updatePasswordData {
    oldPassword: string,
    newPassword: string
}
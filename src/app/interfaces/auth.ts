export interface LoginUserDto {
    username: string;
    password: string;
}

export interface RegisterUserDto {
    username: string;
    password: string;
    email: string;
}

export interface TokenResponseDto {
    token: string;
    refreshToken: string;
}
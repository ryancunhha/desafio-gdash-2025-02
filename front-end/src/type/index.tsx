export interface Clima {
    _id: string;
    data_hora: string;
    temperatura: number;
    velocidade_vento: number;
    umidade: number;
    probabilidade: number;
    nuvens: number;
}

export interface User {
    _id: string;
    email: string;
    role: string;
    password: string;
}

export interface ClimaResponse {
    data: Clima[];
}

export interface UserResponse {
    data: User[];
}

export interface LoginCredenciais {
    email: string;
    password: string;
}

export interface CriarUserRequest {
    email: string;
    password: string;
    role: string;
}

export interface updateUserRequest {
    email?: string;
    password?: string;
    role?: string;
}
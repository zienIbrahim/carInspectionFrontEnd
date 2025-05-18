export interface GetAllUsersRequest{
    Id?:number,
    FullName?:string|null,
    Email?:string|null,
    PhoneNumber?:string|null,
    PageNumber:number,
    PageSize:number,
}

export interface GetAllUsersReresponseData{
    id: number
    fullName: string
    email: string
    phoneNumber: string
    role: string
}
export interface CreateUserRequest{
    fullName: string
    email: string
    password: string
    phoneNumber: string
    role: string
}
export interface UpdateUserRequest{
    id: number
    fullName: string
    email: string
    phoneNumber: string
    role: string
}
export interface User{
    id: number
    fullName: string
    email: string
    phoneNumber: string
    role: string
}
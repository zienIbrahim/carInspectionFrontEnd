export interface GetAllResultRequest{
    Id?:number,
    NameAr?:string|null,
    NameEn?:string|null,   
    PageNumber:number,
    PageSize:number,
}
export interface GetAllResultReresponseData{
    id: number
    nameAr: string,
    nameEn: string,
    color: string,
}
export interface CreateResultRequest {
    nameAr: string,
    nameEn: string,
    description: string,
    color: string,
}
export interface Result {
    id: number,
    nameAr: string,
    nameEn: string,
    description: string
    color: string
}
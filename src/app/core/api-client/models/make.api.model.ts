export interface GetAllMakeRequest{
    Id?:number,
    NameAr?:string|null,
    NameEn?:string|null,   
    PageNumber:number,
    PageSize:number,
}
export interface GetAllMakeReresponseData{
    id: number
    nameAr: string
    nameEn: string,
    logo:string

}
export interface CreateMakeRequest {
    nameAr: string,
    nameEn: string,
    logo:string
}
export interface Make {
    id: number,
    nameAr: string,
    nameEn: string,
    logo:string
}
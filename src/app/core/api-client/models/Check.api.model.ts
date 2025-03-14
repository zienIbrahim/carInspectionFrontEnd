export interface GetAllCheckRequest{
    Id?:number,
    NameAr?:string|null,
    NameEn?:string|null,   
    categoryId?:number,   
    PageNumber:number,
    PageSize:number,
}
export interface GetAllCheckReresponseData{
    id: number
    nameAr: string
    nameEn: string
    categoryAr: string
    categoryEn: string
}
export interface CreateCheckRequest {
    nameAr: string,
    nameEn: string,
    categoryId: number,
}

export interface Check {
    id: number,
    nameAr: string,
    nameEn: string,
    categoryId: number,

}
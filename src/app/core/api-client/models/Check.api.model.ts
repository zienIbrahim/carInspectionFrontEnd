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
    results:CheckResults[]
}

export interface Check {
    id: number,
    nameAr: string,
    nameEn: string,
    categoryId: number,
    results:CheckResults[]
}
export interface CheckResults {
    resultId:number,
}
export interface CheckDetails {
    id: number,
    nameAr: string,
    nameEn: string,
    categoryId: number,
    result:CheckDetailsResults[]
}
export interface CheckDetailsResults {
    id: number,
    nameAr: string,
    nameEn: string,
    description: string
    color: string
}


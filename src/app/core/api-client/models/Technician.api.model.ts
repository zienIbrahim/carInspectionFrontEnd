export interface GetAllTechnicianRequest{
    Id?:number,
    NameAr?:string|null,
    NameEn?:string|null, 
    userId?: number
    categoryId?: number  
    PageNumber:number,
    PageSize:number,
}
export interface CreateTechnicianRequest {
    nameAr: string,
    nameEn: string,
    userId: number
    categoryId: number
}
export interface Technician {
    id: number
    nameAr: string
    nameEn: string
    userId: number
    categoryId: number
}
export interface GetAllTechnicianReresponseData{
    id: number
    nameAr: string
    nameEn: string
    categoryAr: string
    categoryEn: string
}

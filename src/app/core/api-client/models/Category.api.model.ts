export interface GetAllCategoryRequest{
    Id?:number,
    NameAr?:string|null,
    NameEn?:string|null,   
    PageNumber:number,
    PageSize:number,
}
export interface CreateCategoryRequest {
    nameAr: string,
    nameEn: string,
}
export interface Category {
    id: number
    nameAr: string
    nameEn: string
}


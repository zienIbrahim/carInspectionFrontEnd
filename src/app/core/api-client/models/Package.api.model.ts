export interface GetAllPackageRequest{
    Id?:number,
    NameAr?:string|null,
    NameEn?:string|null,   
    PageNumber:number,
    PageSize:number,
}
export interface GetAllPackageReresponseData{
    id: number
    nameAr: string
    nameEn: string
    description: string, 
}
export interface CreatePackageRequest {
    nameAr: string,
    nameEn: string, 
    description: string, 
    haveVisualInspection: boolean, 
    packageDetails:PackageDetails[]
}
export interface Package {
    id: number, 
    nameAr: string,
    nameEn: string, 
    description: string, 
    haveVisualInspection: boolean, 
    packageDetails:PackageDetails[]
}
export interface PackageDetails {
    checkId: number, 
}

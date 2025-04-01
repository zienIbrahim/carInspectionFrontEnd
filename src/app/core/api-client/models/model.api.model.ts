export interface GetAllModelRequest{
    Id?:number,
    NameAr?:string|null,
    NameEn?:string|null,   
    makeId?:number,   
    ModelType?:number,   
    PageNumber:number,
    PageSize:number,
}
export interface GetAllModelReresponseData{
    id: number
    nameAr: string
    nameEn: string
    makeId: number,
}
export interface CreateModelRequest {
    nameAr: string,
    nameEn: string,
    makeId: number,
    modelType: number,

}

export interface Model {
    id: number,
    nameAr: string,
    nameEn: string,
    makeId: number,
    modelType: number,
}
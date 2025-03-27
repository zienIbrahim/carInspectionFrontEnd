export interface GetAllInspectionRequest {
    Id?: number,
    Name?: string,
    From?: string,
    To?: string,
    PhoneNumber?: string,
    PackageId?: string,
    PlateNumber?: string,
    PageNumber: number,
    PageSize: number,
}
export interface GetAllInspectionReresponseData {
    id: number,
    inspectionDate: string,
    plateNumber: string,
    make: string,
    model: string,
    color: string,
    year: number,
    packageAr: number,
    packageEn: number,
    name: string,
    phoneNumber: string,
}

export interface CreateInspectionRequest {
    packageId: number,
    inspectionDate: string,
    plateNumber: string,
    vINNumber: string,
    makeId: string,
    modelId: string,
    color: string,
    year: number,
    name: string,
    phoneNumber: string,
    email?: string,
    note?: string,
}
export interface Inspection {
    id: number,
    packageId: number,
    inspectionDate: string,
    plateNumber: string,
    vINNumber: string,
    make: string,
    model: string,
    color: string,
    year: number,
    name: string,
    phoneNumber: string,
    email?: string,
    note?: string,
}
export interface InspectionCheckList {
  id: number
  nameEn: string
  nameAr: string
  categoryId: number
  categoryAr: string
  categoryEn: string
  results: Result[]
}
export interface CheckListByIDES {
  id: number
  description: string
  nameEn: string
  nameAr: string
  color: string
  checkId: number
}


export interface Result {
  id: number
  description: string
  nameEn: string
  nameAr: string
  color: string
}
export interface InspectionDetails {
    id: number
    packageId: number
    inspectionDate: string
    plateNumber: string
    make: string
    model: string
    color: string
    year: number
    note: string
    vinNumber: string
    phoneNumber: string
    name: string
    email: string
    results: InspectionDetailsResult[]
}
  
  export interface InspectionDetailsResult {
    checkId: number
    categoryId: number
    technicianID: number
    comment: string
    checkEn: string
    checkAr: string
    categoryAr: string
    categoryEn: string
    technicianAr: string
    technicianEn: string
    result: Result
    images: string[]
  }
  export interface CreateOrUpdateInspectionResultDto {
    inspectionID: number
    data: CreateOrUpdateInspectionResultData[]
  }
  
  export interface CreateOrUpdateInspectionResultData {
    inspectionID: number
    checkId: number
    resultId: string
    comment: string
    images: string[]
  }
  
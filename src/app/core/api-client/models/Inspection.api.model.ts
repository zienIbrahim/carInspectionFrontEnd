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
    status: number,
    inspectionDate: string,
    plateNumber: string,
    makeAr: string,
    makeEn: string,
    modelAr: string,
    modelEn: string,
    color: string,
    year: number,
    packageAr: number,
    packageEn: number,
    name: string,
    phoneNumber: string,
}

export interface CreateInspectionRequest {
    packageId: number,
    plateNumber: string,
    vINNumber: string,
    makeId: string,
    modelId: string,
    color: string,
    year: number,
    odometer: number,
    name: string,
    phoneNumber: string,
    email?: string,
    note?: string,
}
export interface EditInspectionRequest {
  id: number,
  packageId: number,
  plateNumber: string,
  vINNumber: string,
  makeId: string,
  modelId: string,
  color: string,
  year: number,
  odometer: number,
  name: string,
  phoneNumber: string,
  email?: string,
  note?: string,
}
export interface Inspection {
    id: number,
    status: number,
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
  status: number
  plateNumber: string
  makeId: number
  modelId: number
  color: string
  makeAr: string
  makeImage: string
  makeEn: string
  modelAr: string
  modelType: number
  modelEn: string
  year: number
  odometer: number
  note: string
  vinNumber: string
  phoneNumber: string
  name: string
  email: string
  results: InspectionDetailsResult[]
  visualResult: InspectionDetailsVisualResult[]
}
export interface InspectionById {
  id: number,
  packageId: number,
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

export interface InspectionDetailsVisualResult {
   imageDirction:number,
   imageType:number,
   imageUrl:string,
   comment?:string,
   markers?:string,
   technicianAr:string,
   technicianEn:string,
   technicianID:number,
   inspectionResultId:number,
}

export interface InspectionDetailsResult {
  checkId: number
  checkEn: string
  checkAr: string
  categoryId: number
  categoryAr: string
  categoryEn: string
  checkResult: CheckResult[]
  inspectionResult: InspectionResult
}

export interface CheckResult {
  color: string
  description: string
  nameEn: string
  nameAr: string
  id: number
}

export interface InspectionResult {
  technicianID: number
  technicianAr: string
  technicianEn: string
  comment: string
  inspectionResultId: number
  images: string[]
}
  export interface CreateOrUpdateInspectionResultDto {
    inspectionID: number
    data: CreateOrUpdateInspectionResultData[]
  }
  export interface CreateOrUpdateInspectionVisualResultDto {
    inspectionId: number
    results: CreateOrUpdateInspectionVisualResultData[]
  }
  export interface CreateOrUpdateInspectionVisualResultData {
     imageDirction:number,
     imageType:number,
     imageUrl:string,
     markers?:string,
     comment?: string
  }
  
  export interface CreateOrUpdateInspectionResultData {
    inspectionID: number
    checkId: number
    resultId: string
    comment: string
    images: string[]
  }
  
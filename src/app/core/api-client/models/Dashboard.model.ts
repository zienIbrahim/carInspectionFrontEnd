export interface DashboardQuery {
    totalInspections: number
    completedInspections: number
    pendingInspections: number
    partiallyCompleted: number
    cancelledRate: number
    inspectionsByMonth: InspectionsByMonth[]
    inspectionSummaryData: InspectionSummaryDaum[]
  }
  
  export interface InspectionsByMonth {
    year: number
    month: number
    count: number
  }
  
  export interface InspectionSummaryDaum {
    inspectionID: number
    inspectionDate: string
    status: number
    plateNumber: string
    packageNameAr: string
    packageNameEn: string
    customerName: string
  }
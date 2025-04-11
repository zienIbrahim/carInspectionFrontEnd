export interface InspectionStatus { 
    [key: number]: {
        nameEn: string;
        nameAr: string;
        color: string 
    } 
}
export const InspectionStatusOption:InspectionStatus = {
    1: { nameEn: "Pending", nameAr: "قيد الانتظار", color: "#FFA500" },
    2: { nameEn: "Partially Completed", nameAr: "مكتمل جزئياً", color: "#1E90FF" },
    3: { nameEn: "Completed", nameAr: "مكتمل", color: "#28A745" }, 
    4: { nameEn: "Cancelled", nameAr: "ملغى", color: "#DC3545" }, 
    5: { nameEn: "Reinspection Required", nameAr: "مطلوب إعادة الفحص", color: "#FFC107" }
};
export const ImageType = {
    1: { nameEn: "Visual Inspection", nameAr: "فحص بصري" },
    2: { nameEn: "Vehicle Image ", nameAr: "صور المركبة" },
}
export const ImageDirction = {
    1: { nameEn: "Front", nameAr: "الأمام" },
    2: { nameEn: "Back", nameAr: "الخلف" },
    3: { nameEn: "Left", nameAr: "اليسار" }, 
    4: { nameEn: "Right", nameAr: "اليمين" },
    5: { nameEn: "Roof", nameAr: "السقف" }
};





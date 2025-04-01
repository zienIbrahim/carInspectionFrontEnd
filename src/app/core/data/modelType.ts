export const modelTypeData:ModelType[]=[
    { id: 1, name: "Sedan", nameAr: "سيدان" },
    { id: 2, name: "Hatchback", nameAr: "هاتشباك" },
    { id: 3, name: "SUV", nameAr: "سيارة رياضية متعددة الاستخدامات" },
    { id: 4, name: "Coupe", nameAr: "كوبيه" },
    { id: 5, name: "Convertible", nameAr: "كشف" },
    { id: 6, name: "Pickup Truck", nameAr: "بيك أب" },
    { id: 7, name: "Minivan", nameAr: "ميني فان" },
    { id: 8, name: "Crossover", nameAr: "كروس أوفر" },
    { id: 9, name: "Station Wagon", nameAr: "ستيشن واجن" },
    { id: 10, name: "Roadster", nameAr: "رودستر" },
    { id: 11, name: "Van", nameAr: "فان" },
    { id: 12, name: "Jeep", nameAr: "جيب" },
    { id: 13, name: "Muscle Car", nameAr: "سيارة عضلية" },
    { id: 14, name: "Supercar", nameAr: "سيارة سوبر" },
    { id: 15, name: "Hypercar", nameAr: "سيارة هايبر" }
]
export const modelTypeImageUrl: { id: number,Images: string[]}[]=[
{
    id:1,
    Images:[
        'car-sedan-1.JPG',
        'car-sedan-2.JPG',
        'car-sedan-3.JPG',
        'car-sedan-4.JPG',
    ]
},
{
    id:6,
    Images:[
        'car-pickup-1.JPG',
        'car-pickup-2.JPG',
        'car-pickup-3.JPG',
        'car-pickup-4.JPG',
    ]
}
]
export interface ModelType {
    id: number;
    name: string;
    nameAr: string;
}
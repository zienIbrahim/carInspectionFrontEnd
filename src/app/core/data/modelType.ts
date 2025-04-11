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
export const modelTypeImageUrl: { id: number,Images: {url:string,dir:number}[]}[]=[
{
    id:1,
    Images:[
        {url:'car-sedan-1.JPG',dir:1},
        {url:'car-sedan-2.JPG',dir:2},
        {url:'car-sedan-3.JPG',dir:3},
        {url:'car-sedan-4.JPG',dir:4},
        {url:'car-sedan-4.JPG',dir:5},
    ]
},
{
    id:2,
    Images:[
        {url:'car-pickup-1.JPG',dir:1},
        {url:'car-pickup-2.JPG',dir:2},
        {url:'car-pickup-3.JPG',dir:3},
        {url:'car-pickup-4.JPG',dir:4},
        {url:'car-pickup-4.JPG',dir:5},
    ]
}
,
{
    id:3,
    Images:[
        {url:'car-pickup-1.JPG',dir:1},
        {url:'car-pickup-2.JPG',dir:2},
        {url:'car-pickup-3.JPG',dir:3},
        {url:'car-pickup-4.JPG',dir:4},
        {url:'car-pickup-4.JPG',dir:5},
    ]
}
,
{
    id:4,
    Images:[
        {url:'car-pickup-1.JPG',dir:1},
        {url:'car-pickup-2.JPG',dir:2},
        {url:'car-pickup-3.JPG',dir:3},
        {url:'car-pickup-4.JPG',dir:4},
        {url:'car-pickup-4.JPG',dir:5},
    ]
}
,
{
    id:5,
    Images:[
        {url:'car-pickup-1.JPG',dir:1},
        {url:'car-pickup-2.JPG',dir:2},
        {url:'car-pickup-3.JPG',dir:3},
        {url:'car-pickup-4.JPG',dir:4},
        {url:'car-pickup-4.JPG',dir:5},
    ]
}
]
export interface ModelType {
    id: number;
    name: string;
    nameAr: string;
}
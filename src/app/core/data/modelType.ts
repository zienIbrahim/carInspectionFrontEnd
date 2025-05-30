export const modelTypeData:ModelType[]=[
    { id: 1, name: "Sedan", nameAr: "سيدان" },
    { id: 2, name: "Hatchback", nameAr: "هاتشباك" },
    { id: 3, name: "Pickup Truck", nameAr: "بيك أب" },
    { id: 4, name: "SUV", nameAr: "سيارة متعددة الاستخدامات" },

]
export const modelTypeImageUrl: { id: number,Images: {url:string,dir:number}[]}[]=[
{
    id:1,
    Images:[
        {url:'sedan-1.JPG',dir:1},
        {url:'sedan-2.JPG',dir:2},
        {url:'sedan-3.JPG',dir:3},
        {url:'sedan-4.JPG',dir:4},
        {url:'sedan-5.JPG',dir:5},
    ]
},
{
    id:2,
    Images:[
        {url:'Hatchback-1.JPG',dir:1},
        {url:'Hatchback-2.JPG',dir:2},
        {url:'Hatchback-3.JPG',dir:3},
        {url:'Hatchback-4.JPG',dir:4},
        {url:'Hatchback-5.JPG',dir:5},
    ]
}
,
{
    id:3,
     Images:[
        {url:'Pickup-1.JPG',dir:1},
        {url:'Pickup-2.JPG',dir:2},
        {url:'Pickup-3.JPG',dir:3},
        {url:'Pickup-4.JPG',dir:4},
        {url:'Pickup-5.JPG',dir:5},
    ]
}
,
{
    id:4,
    Images:[
        {url:'SUV-1.JPG',dir:1},
        {url:'SUV-2.JPG',dir:2},
        {url:'SUV-3.JPG',dir:3},
        {url:'SUV-4.JPG',dir:4},
        {url:'SUV-5.JPG',dir:5},
    ]
}
]
export const ImageDirction = {
    1: { nameEn: "Front", nameAr: "الأمام" },
    2: { nameEn: "Back", nameAr: "الخلف" },
    3: { nameEn: "Left", nameAr: "اليسار" }, 
    4: { nameEn: "Right", nameAr: "اليمين" },
    5: { nameEn: "Roof", nameAr: "السقف" }
};
export interface ModelType {
    id: number;
    name: string;
    nameAr: string;
}
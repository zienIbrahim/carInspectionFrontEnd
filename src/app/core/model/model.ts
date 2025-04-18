import { TemplateRef } from "@angular/core";

export interface resultList {
    id: number
    nameAr: string
    nameEn: string
}
export const resultListData:resultList[]=[
    {
        id: 1,
        nameAr: "جيد",
        nameEn: "good"
    },
    {
        id: 1,
        nameAr: "تالف",
        nameEn: "damage"
    },
    {
        id: 1,
        nameAr: "يحتاج إصلاح",
        nameEn: "Needs repair"
    },
]
export interface ToastMessage {
    header: ToastMessageData;
    body: ToastMessageData;
    uuid: string;
    options?: ToastMessageOptions;
    Link?:string
}
export type ToastMessageData = string | TemplateRef<unknown>;

export interface ToastMessageOptions {
    autohide?: boolean;
    delay?: number;
    classes?: string;
    headerClasses?: string;
    bodyClasses?: string;
}

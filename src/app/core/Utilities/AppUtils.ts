export default class AppUtils {
    public static addDays(date: Date, numOfDays: number) {
        date = new Date(new Date().getTime() + 86400000 * numOfDays);
        return date;
    }
    public static groupBy<T>(arr: Array<T>, key: keyof T): Record<any, Array<T>> {
        const result = {} as Record<any, Array<T>>;
        for (const item of arr) {
            const groupKey = item[key];
            if (!result[groupKey]) {
                result[groupKey] = [] as any;
            }
            result[groupKey].push(item);
        }
        return result;
    }
}
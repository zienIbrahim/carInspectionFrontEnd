export interface PaginatedResult<T> {
    pageNumber: number
    pageSize: number
    totalCount: number
    data: T[]
}


import { APITypes } from "../APITypes";

export interface Helper {
    search(searchText: string): Promise<any>
}

export interface USDAApiResult {
    foodSearchCriteria: any
    totalHits: number
    currentPage: number
    totalPages: number
    foods: USDAFood[]
}

export interface USDAFood {
    fdcId: number
    description: string
    scientificName?: string
    commonNames?: any
    additionalDescriptions?: string
    dataType: string
    foodCode?: string
    gtinUpc?: string,
    ndbNumber?: string
    publishedDate: string
    brandOwner?: string
    ingredients: string
    allHighlightFields: string
    score: number
}

export interface USDASearchResult {
    description: string,
    fdcId: number,
    api: APITypes.USDA
}
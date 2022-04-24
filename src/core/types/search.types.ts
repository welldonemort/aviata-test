export type FlightT = {
    itineraries: ItineraryT[][]
    services: any
    validating_carrier: string
    price: string
    best_time: number
    refundable: boolean
}

export type ActiveOptionsT = {
    tariffs: string[]
    airlines: string[]
}

export type ItineraryT = {
    dep_date: string
    arr_date: string
    carrier_name: string
    segments: SegmentT[]
    stops: number
    traveltime: number
    refundable: boolean
    layovers: number[]
}

export type SegmentT = {
    origin_code: string
    dest_code: string
    dep_time: string
    arr_time: string
    dest: string
}

export type OptionT = {
    id: number
    value: string
    is_active: boolean
    filter_by?: string
    type?: string
}
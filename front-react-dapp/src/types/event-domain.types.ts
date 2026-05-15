export interface EventResponse {
    id: number;
    name: string;
    date: string;
    deadline: string;
    participants_amount: number;
    is_admin: boolean;
}

export interface RecipientResponse {
    id: number;
    first_name: string;
    last_name: string;
}

export interface JoinEventResponse {
    event_id: number;
    error: string;
}

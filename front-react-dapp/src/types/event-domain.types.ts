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
    wallet_address: string;
}

export interface PayerResponse {
    id: number;
    first_name: string;
    last_name: string;
    is_paid: boolean;
    amount?: number;
}

export interface JoinEventResponse {
    event_id: number;
    error: string;
}

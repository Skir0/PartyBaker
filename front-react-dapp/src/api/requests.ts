export interface CreateEventRequest {
    name: string;
    date: string;
    deadline: string;
    admin_id: number;
}

export interface UpdateEventRequest {
    name: string;
    date: string;
    deadline: string;
}

export interface UpdateGiftRequest {
    name: string;
    target_amount: number;
    description: string;
    url: string;
}

export interface CreateGiftRequest {
    name: string;
    link: string;
    target_amount: number;
    contract_address: string;
    jetton_address: string;
    recipient_id: number;
    description: string;
    image_url: string;
}
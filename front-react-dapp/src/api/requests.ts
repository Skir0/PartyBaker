export interface CreateEventRequest {
    name: string;
    date: string;
    deadline: string;
    admin_id: number;
}

export interface GetEventsRequest {
    user_id: number;
}
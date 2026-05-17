export interface GiftSuggestion {
    id: number;
    title: string;
    price: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    supporterBadges: Array<{
        label: string;
        className: string;
        textClassName?: string;
    }>;
    likes: number;
    liked: boolean | false;
}

export interface GiftInfoResponse {
    id: number;
    name: string;
    link: string;
    status: string;
    contract_address: string;
    admin_id: number;
    target_amount: number;
    collected_amount: number;
    recipient_id: number;
    description: string;
    image_url: string;
    likes_amount?: number;
    liked_by_user?: boolean;
}

export interface RecipientGiftFolder {
    id: string;
    recipientName: string;
    subtitle: string;
    suggestions: GiftSuggestion[];
}

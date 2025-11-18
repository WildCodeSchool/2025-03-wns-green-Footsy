export interface ActivityType {
    id: number;
    name: string;
    category?: string;
}

export interface GetActivityTypesData {
    getActivityTypes: ActivityType[];
}
import axios from 'axios';

export interface Activity {
    id: string;
    userId: string;
    year: number;
    // Ajoutez d'autres champs selon votre modèle d'activité
    [key: string]: any;
}

export async function findActivitiesByUserIdAndYear(userId: string, year: number): Promise<Activity[]> {
    const response = await axios.get<Activity[]>(`/api/activities`, {
        params: { userId, year }
    });
    return response.data;
}

export async function findCategoryStatisticsByUserIdAndYear(userId: string, year: number): Promise<any> {
    const response = await axios.get<any>(`/api/activities/category-statistics`, {
        params: { userId, year }
    });
    return response.data;
}
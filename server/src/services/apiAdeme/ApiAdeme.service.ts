import apiAdeme from "./ApiAdeme.config";
import { Categorie, QuantityUnit, Type, ApiResponse, THEMATIQUE_UNITS } from "./ApiAdeme.type";

class ApiAdemeService {
    async getCategories(): Promise<Categorie[]> {
        try {
            const response = await apiAdeme.get<ApiResponse<Categorie>>('/thematiques');
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories', error);
            throw new Error(`Impossible de récupérer les catégories depuis l'API Ademe`);
        }
    }

    async getTypes(categoryId: number): Promise<Type[]> {
        try {
            const response = await apiAdeme.get<ApiResponse<Type>>(`/thematiques/ecv/${categoryId}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des types', error);
            throw new Error(`Impossible de récupérer les types depuis l'API Ademe`);
        }
    }

    getQuantityUnit(categoryId: number): QuantityUnit | undefined {
        return THEMATIQUE_UNITS[categoryId];
    }
}

export default new ApiAdemeService();
process.env.ADEME_API_KEY = 'fake-key-for-tests';
jest.mock('../apiAdeme/ApiAdeme.config');

import ApiAdemeService from "../apiAdeme/ApiAdeme.service";
import apiAdeme from "../apiAdeme/ApiAdeme.config";

const mockedApiAdeme = apiAdeme as jest.Mocked<typeof apiAdeme>;

describe('ApiAdemeService', () => {
    describe('getCategories', () => {
        it("should return catgories when Api call succeed", async () => {
            //Arrange
            const mockCategories = [
                { id: 1, name: "Numérique", slug: "numerique" },
                { id: 2, name: "Alimentation", slug: "alimentation" }
            ];
            mockedApiAdeme.get.mockResolvedValue({
                data: { data: mockCategories }
            });
            //Act
            const result = await ApiAdemeService.getCategories();
            //Assert
            expect(mockedApiAdeme.get).toHaveBeenCalledWith('/thematiques');
            expect(result).toEqual(mockCategories)
        });

        it("should throw an error when API call fails", async () => {
            //Arrange
            mockedApiAdeme.get.mockRejectedValue(new Error('Network error'));
            //Act & Assert
            await expect(ApiAdemeService.getCategories()).rejects.toThrow(
                'Impossible de récupérer les catégories depuis l\'API Ademe'
            );
        });
    });

    describe('getTypes', () => {
        it('should return types when Api call succeed', async () => {
            //Arrange
            const categoryId = 4;
            const mockTypes = [
                { name: "Voiture thermique", slug: "voiturethermique", ecv: 0.21760 },
                { name: "Autocar thermique", slug: "autocar", ecv: 0.03756 },
            ]
            mockedApiAdeme.get.mockResolvedValue({
                data: { data: mockTypes }
            });
            //Act
            const result = await ApiAdemeService.getTypes(categoryId);
            //Assert
            expect(mockedApiAdeme.get).toHaveBeenCalledWith(`/thematiques/ecv/${categoryId}`)
            expect(result).toEqual(mockTypes);
        });

        it("should throw an error when API call fails", async () => {
            //Arrange
            const categoryID = 999;
            mockedApiAdeme.get.mockRejectedValue(new Error('Network error'));
            //Act & Assert
            await expect(ApiAdemeService.getTypes(categoryID)).rejects.toThrow(
                `Impossible de récupérer les types depuis l'API Ademe`
            );
        });
    });

    describe('getQuantityUnit', () => {
        it('should return quantity unit "kg" when category id is 2', () => {
            //Arrange 
            const categoryId = 2;
            //Act
            const result = ApiAdemeService.getQuantityUnit(categoryId);
            //Assert
            expect(result).toEqual("kg");
        });

        it('should return undefined when category id is 999', () => {
            //Arrange 
            const categoryId = 999;
            //Act
            const result = ApiAdemeService.getQuantityUnit(categoryId);
            //Assert
            expect(result).toBeUndefined();
        });
    });
});
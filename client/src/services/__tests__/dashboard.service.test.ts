import axios from 'axios';
import { findActivitiesByUserIdAndYear, type Activity } from '../dashboard.service';
import { describe, it, expect, vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

describe('findActivitiesByUserIdAndYear', () => {
    const userId = 'user123';
    const year = 2024;
    const mockActivities: Activity[] = [
        { id: '1', userId, year, name: 'Activity 1' },
        { id: '2', userId, year, name: 'Activity 2' },
    ];

    it('should fetch activities by userId and year', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockActivities });

        const result = await findActivitiesByUserIdAndYear(userId, year);

        expect(mockedAxios.get).toHaveBeenCalledWith('/api/activities', {
            params: { userId, year },
        });
        expect(result).toEqual(mockActivities);
    });

    it('should throw if axios fails', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

        await expect(findActivitiesByUserIdAndYear(userId, year)).rejects.toThrow('Network error');
    });
});
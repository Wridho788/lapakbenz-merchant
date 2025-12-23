import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { locationApi } from "../services/location.api";

export function useProvinceList(): UseQueryResult<any, Error> {
    return useQuery({
        queryKey: ['province'],
        queryFn: async () => {
            try {
                return await locationApi.getProvinces();
            } catch (error) {
                throw error;
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        retry: 2,
    });
}

export function useCityListByProvince(provinceId: string): UseQueryResult<any, Error> {
    return useQuery({
        queryKey: ['city', provinceId],
        queryFn: async () => {
            try {
                return await locationApi.getCities(provinceId);
            } catch (error) {
                throw error;
            }
        },
        enabled: !!provinceId,
        staleTime: 1000 * 60 * 60, // 1 hour
        retry: 2,
    });
}

export function useDistrictListByCity(cityId: string): UseQueryResult<any, Error> {
    return useQuery({
        queryKey: ['district', cityId],
        queryFn: async () => {
            try {
                return await locationApi.getDistricts(cityId);
            } catch (error) {
                throw error;
            }
        },
        enabled: !!cityId,
        staleTime: 1000 * 60 * 60, // 1 hour
        retry: 2,
    });
}
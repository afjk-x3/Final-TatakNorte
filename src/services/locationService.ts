
// Service to fetch Philippine location data using PSGC API

const BASE_URL = 'https://psgc.gitlab.io/api';

export interface LocationCode {
  code: string;
  name: string;
}

export const fetchProvinces = async (): Promise<LocationCode[]> => {
  try {
    const response = await fetch(`${BASE_URL}/provinces.json`);
    const data = await response.json();
    return data.map((item: any) => ({ code: item.code, name: item.name })).sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch provinces", error);
    return [];
  }
};

export const fetchCities = async (provinceCode: string): Promise<LocationCode[]> => {
  try {
    const response = await fetch(`${BASE_URL}/provinces/${provinceCode}/cities-municipalities.json`);
    const data = await response.json();
    return data.map((item: any) => ({ code: item.code, name: item.name })).sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch cities", error);
    return [];
  }
};

export const fetchBarangays = async (cityCode: string): Promise<LocationCode[]> => {
  try {
    const response = await fetch(`${BASE_URL}/cities-municipalities/${cityCode}/barangays.json`);
    const data = await response.json();
    return data.map((item: any) => ({ code: item.code, name: item.name })).sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch barangays", error);
    return [];
  }
};

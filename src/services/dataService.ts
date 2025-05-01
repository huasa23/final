import { Driver, Location } from "../interfaces/interface";

async function fetchWithRetry(url: string, options = {}, maxRetries = 3, delay = 1000): Promise<any> {
  let retries = 0;
  
  while (true) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      retries++;
      console.warn(`request failed(${url})，retry ${retries}/${maxRetries}:`, error);
      
      if (retries >= maxRetries) {
        console.error(`reach max retries(${url}):`, error);
        return [];
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * retries));
    }
  }
}

export default async function dataService(sessionId: string) {
    
    let allDrivers: Driver[] = [];
    let allDriversData: Record<number, Driver> = {};
    let allDriversLocationData: Record<number, Location[]> = {};

    try {
        // drivers data
        allDrivers = await fetchWithRetry(`/api/drivers?session_key=${sessionId}`);
        
        for (const driver of allDrivers) {
            allDriversData[driver.driver_number] = driver;
        }
        
        // location data
        const locationPromises = allDrivers.map(async (driver) => {
            try {
                const locations = await fetchWithRetry(`/api/location?session_key=${sessionId}&driver_number=${driver.driver_number}&date>2023-10-29T20:00:00+00:00&date<2023-10-29T22:00:00+00:00`);
                return { driver, locations };
            } catch (error) {
                console.error(`get driver ${driver.driver_number} location data failed:`, error);
                return { driver, locations: [] };
            }
        });
        
        const locationResults = await Promise.all(locationPromises);
        locationResults.forEach(({ driver, locations }) => {
            allDriversLocationData[driver.driver_number] = locations;
        });
        
    } catch (error) {
        console.error("Error during data fetching:", error);
    }
    
    return {allDriversData, allDriversLocationData};
}
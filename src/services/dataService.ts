import { Driver, Location, Position, CarData } from "../interfaces/interface";

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
      console.warn(`请求失败(${url})，尝试重试 ${retries}/${maxRetries}:`, error);
      
      if (retries >= maxRetries) {
        console.error(`达到最大重试次数(${url}):`, error);
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * retries));
    }
  }
}

export default async function dataService(sessionId: string) {
    
    let allDrivers: Driver[] = [];
    let allDriversData: Record<number, Driver> = {};
    let allDriversLocationData: Record<number, Location[]> = {};
    let rankData: Position[] = [];
    let allDriversCarData: Record<number, CarData[]> = {};

    try {
        // 获取车手数据
        allDrivers = await fetchWithRetry(`/api/drivers?session_key=${sessionId}`);
        
        for (const driver of allDrivers) {
            allDriversData[driver.driver_number] = driver;
        };
        //console.log("allDrivers", allDrivers);
        
        // 使用Promise.all并捕获每个单独的错误
        const locationPromises = allDrivers.map(async (driver) => {
            try {
                const locations = await fetchWithRetry(`/api/location?session_key=${sessionId}&driver_number=${driver.driver_number}`);
                return { driver, locations };
            } catch (error) {
                console.error(`获取车手${driver.driver_number}位置数据失败:`, error);
                return { driver, locations: [] }; // 返回空数组作为占位符
            }
        });
        
        const locationResults = await Promise.all(locationPromises);
        locationResults.forEach(({ driver, locations }) => {
            allDriversLocationData[driver.driver_number] = locations;
        });
        //console.log("allDriversLocationData", allDriversLocationData);
        
        // 类似地处理车手数据
        // const carDataPromises = allDrivers.map(async (driver) => {
        //     try {
        //         const carData = await fetchWithRetry(`/api/car_data?session_key=${sessionId}&driver_number=${driver.driver_number}`);
        //         return { driver, carData };
        //     } catch (error) {
        //         console.error(`获取车手${driver.driver_number}车辆数据失败:`, error);
        //         return { driver, carData: [] }; // 返回空数组作为占位符
        //     }
        // });
        
        // const carDataResults = await Promise.all(carDataPromises);
        // carDataResults.forEach(({ driver, carData }) => {
        //     allDriversCarData[driver.driver_number] = carData;
        // });
        // console.log("allDriversCarData", allDriversCarData);
        
        // // 排名数据
        // try {
        //     rankData = await fetchWithRetry(`/api/position?session_key=${sessionId}`);
        // } catch (error) {
        //     console.error("获取排名数据失败:", error);
        //     rankData = []; // 失败时使用空数组
        // }
        // console.log("rankData", rankData);
        
    } catch (error) {
        console.error("数据获取过程中出现错误:", error);
        // 即使出错也继续返回已获取的部分数据
    }
    
    return {allDriversData, allDriversLocationData, allDriversCarData, rankData};
}
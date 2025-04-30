import React, { useState, useEffect, useRef } from "react";
import dataService from "../services/dataService";
import { Driver, Location, Position, CarData } from "../interfaces/interface";

const useCanvasAnimation = (sessionId: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBgRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressButtonRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const pauseButtonRef = useRef<HTMLButtonElement>(null);
  const currentTimeDisplayRef = useRef<HTMLDivElement>(null);
  const totalTimeDisplayRef = useRef<HTMLDivElement>(null);
  const progressBarContainerRef = useRef<HTMLDivElement>(null);
  const cumulativeDistancesRef = useRef<Record<number, number>>({});

  // current rank
  const [currentRanks, setCurrentRanks] = useState<{ driverNumber: number, distance: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [minX, setMinX] = useState(0);
  const [minY, setMinY] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const [scale, setScale] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scaleX, setScaleX] = useState(0);
  const [scaleY, setScaleY] = useState(0);
  const [mapWidth, setMapWidth] = useState(650);
  const [mapHeight, setMapHeight] = useState(650);

  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [animationFrameId, setAnimationFrameId] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [progressBarRect, setProgressBarRect] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  });
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [allDriversData, setAllDriversData] = useState<Record<number, Driver>>({});
  const [allDriversLocationData, setAllDriversLocationData] = useState<Record<number, Location[]>>({});
  const [allDriversCarData, setAllDriversCarData] = useState<Record<number, CarData[]>>({});
  const [positionData, setPositionData] = useState<Position[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const {allDriversData, allDriversLocationData, allDriversCarData, rankData} = await dataService(sessionId);
      console.log("allDriversData", allDriversData);
      console.log("allDriversLocationData", allDriversLocationData);
      setAllDriversData(allDriversData);
      setData(allDriversLocationData[1]);
      setAllDriversLocationData(allDriversLocationData);

      // initialize cumulative distances to 0 for all
      Object.keys(allDriversLocationData).forEach(driverNumber => {
          cumulativeDistancesRef.current[parseInt(driverNumber)] = 0;
      });


        fetch("/position_data.json")
      .then((response) => response.json())
      .then((jsonData: Position[]) => {
        setPositionData(jsonData);
      });

      let car_data = new Array<CarData[]>(2);
      fetch("/car_data_1.json")
      .then((response) => response.json())
      .then((jsonData: CarData[]) => {
        car_data[0] = jsonData;
      });
      fetch("/car_data_2.json")
      .then((response) => response.json())
      .then((jsonData: CarData[]) => {
        car_data[1] = jsonData;
      });
      setAllDriversCarData(car_data);
      setLoading(false);
      mapDataSetup(allDriversLocationData);
    };
    fetchData();
  }, [sessionId]);

  //map metadata setup
  const mapDataSetup = (allDriversLocationData: Record<number, Location[]>) => {
    const tempLocationData = allDriversLocationData[1];
    const minX = Math.min(...tempLocationData.map((p) => p.x));
    const minY = Math.min(...tempLocationData.map((p) => p.y));
    const maxX = Math.max(...tempLocationData.map((p) => p.x));
    const maxY = Math.max(...tempLocationData.map((p) => p.y));

    const newScaleX = mapWidth / (maxX - minX);
    const newScaleY = mapHeight / (maxY - minY);
    const scale = Math.min(newScaleX, newScaleY);
    console.log("newScaleX", newScaleX, "newScaleY", newScaleY);
    setScaleX(newScaleX);
    setScaleY(newScaleY);
    setScale(Math.min(newScaleX, newScaleY));

    setOffsetX((mapWidth - (maxX - minX) * scale) / 2);
    setOffsetY((mapHeight - (maxY - minY) * scale) / 2);
    setMinX(Math.min(...tempLocationData.map((p) => p.x)));
    setMinY(Math.min(...tempLocationData.map((p) => p.y)));
    setMaxX(Math.max(...tempLocationData.map((p) => p.x)));
    setMaxY(Math.max(...tempLocationData.map((p) => p.y)));

    const startDate = new Date(tempLocationData[0].date).getTime();
    const endDate = new Date(tempLocationData[tempLocationData.length - 1].date).getTime();
    const duration = endDate - startDate;

    setStartTime(startDate);
    setEndTime(endDate);
    setTotalDuration(duration);

    if (totalTimeDisplayRef.current) {
      totalTimeDisplayRef.current.textContent = `${formatTime(duration)}`;
    }

    setProgressBarRect(
      progressBarContainerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      }
    );
    updateProgressBar(0);
    updateTimeDisplay(0);
  }

  //load background image
  useEffect(() => {
    fetch("/mexico.png")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        return response.blob();
      })
      .then((blob) => {

        const imageUrl = URL.createObjectURL(blob);

        const img = new Image();
        img.src = imageUrl;
        const ctx = canvasBgRef.current?.getContext("2d");
        img.onload = () => {
          const imgWidth = img.width;
          const imgHeight = img.height;
          console.log("imgWidth", imgWidth, "imgHeight", imgHeight);
          ctx?.drawImage(img, 0, 0, canvasBgRef.current?.width || 0, canvasBgRef.current?.height || 0);
          ctx?.restore();
          URL.revokeObjectURL(imageUrl);
        };
      })
      .catch((error) => {
        console.error("Failed to fetch image:", error);
      });
  }, []);

  //draw driver point
  useEffect(() => {
    let currentIndex1 = currentIndex;
    let lastIndex1 = currentIndex - 1;
    let lastUpdateTime1 = 0;

    const updatePoint = (timestamp: number) => {
      if (lastUpdateTime === 0) {
        setLastUpdateTime(timestamp);
      }
      if (currentIndex1 < data.length && lastIndex1 < data.length) {
        const interval =
          new Date(data[currentIndex1].date).getTime() -
          new Date(data[lastIndex1].date).getTime();

        let timeElapsed = timestamp - lastUpdateTime1;

        let progressRatio = interval > 0 ? timeElapsed / interval : 0;
        if (progressRatio > 1) {
          progressRatio = 1;
        }

        const progress = currentIndex1 / data.length + progressRatio / data.length;
        updateProgressBar(progress);

        clearScreen();

        // get driver progress list
        const driverProgressList: { driverNumber: number, distance: number }[] = [];
        //const goal = data[data.length - 1];
        Object.entries(allDriversLocationData).forEach(([driverNumber, locations]) => {
            // console.log(Object.keys(allDriversLocationData).length)
          const num = parseInt(driverNumber);
          const currentDataPoint = locations[currentIndex1];
          const lastDataPoint = locations[lastIndex1];
          const dx = currentDataPoint.x - lastDataPoint.x;
          const dy = currentDataPoint.y - lastDataPoint.y;

          // use pythagorean theorem to calculate segment distance
          const segmentDistance = Math.sqrt(dx * dx + dy * dy);

          // update cumulative distance
          cumulativeDistancesRef.current[num] += segmentDistance;
          driverProgressList.push({
            driverNumber: num,
            distance: cumulativeDistancesRef.current[num],
          });


          const interpolatedX = lastDataPoint.x + (currentDataPoint.x - lastDataPoint.x) * progressRatio;
          const interpolatedY = lastDataPoint.y + (currentDataPoint.y - lastDataPoint.y) * progressRatio;
          const scaledX = (interpolatedX - minX) * scale + offsetX;
          const scaledY = (interpolatedY - minY) * scale + offsetY;


          console.log("driverNumber", driverNumber, "acronym", allDriversData[Number(driverNumber)].name_acronym, "color", allDriversData[Number(driverNumber)].team_colour);


          drawPoint(scaledX, scaledY, allDriversData[Number(driverNumber)].name_acronym, allDriversData[Number(driverNumber)].team_colour);


        });


        driverProgressList.sort((a, b) => b.distance  - a.distance );
        setCurrentRanks(driverProgressList);

        const elapsedTime =
          new Date(data[currentIndex1].date).getTime() - startTime;
        updateTimeDisplay(elapsedTime);

        if (timeElapsed >= interval) {
          lastUpdateTime1 = timestamp;
          lastIndex1 = currentIndex1;
          currentIndex1++;
        }

        setAnimationFrameId(
          requestAnimationFrame((timestamp) => updatePoint(timestamp))
        );
      } else {
        cancelAnimationFrame(animationFrameId);
        setIsPaused(true);
        if (startButtonRef.current) {
          startButtonRef.current.textContent = "Restart";
        }
      }
    };
    if (!isPaused) {
      setAnimationFrameId(
        requestAnimationFrame((timestamp) => updatePoint(timestamp))
      );
    } else {
      console.log("cancelAnimationFrame", animationFrameId);
      cancelAnimationFrame(animationFrameId);
    }
  }, [isPaused]);

  //clear map canvas
  const clearScreen = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    }
  };

  //draw driver point
  const drawPoint = (x: number, y: number, name: string, color: string) => {
    console.log("drawPoint", x, y, name, color);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x+10, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `#${color}`;
      ctx.fill();

      const textX = x + 12;
      const textY = y - 12;

      ctx.font = "15px Arial";
      const textWidth = ctx.measureText(name).width;

      const padding = 3;
      const rectX = textX - padding;
      const rectY = textY - 8;
      const rectWidth = textWidth + padding * 2;
      const rectHeight = 15;
      const cornerRadius = 6;

      ctx.beginPath();
      ctx.roundRect(rectX, rectY, rectWidth, rectHeight, cornerRadius);
      // ctx.fillStyle = "rgba(220, 220, 220, 0)";
      ctx.fillStyle = "#00000019";
      ctx.fill();
      // ctx.strokeStyle = `#${color}`;
      // ctx.lineWidth = 1;
      // ctx.stroke();

      ctx.fillStyle = `#${color}`;
      ctx.textBaseline = "middle";
      ctx.fillText(name, textX, textY);
      ctx.closePath();
    }
  };

  const updateProgressBar = (progress: number) => {
    if (progressBarRef.current && progressButtonRef.current) {
      progressBarRef.current.style.width = `${progress * 100}%`;
      progressButtonRef.current.style.left = `${progress * 100}%`;
    }
  };

  const updateTimeDisplay = (time: number) => {
    setCurrentTime(time);
    if (currentTimeDisplayRef.current) {
      currentTimeDisplayRef.current.textContent = `${formatTime(time)}`;
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenthSeconds = Math.floor((milliseconds % 1000) / 100);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(tenthSeconds)}`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("handleMouseDown");
    setIsDragging(true);
    setIsPaused(true);
    if (pauseButtonRef.current) {
      pauseButtonRef.current.textContent = "Resume";
    }
    setDragOffsetX(
      e.clientX -
        (progressButtonRef.current?.offsetLeft || 0) -
        progressBarRect.left
    );
    setProgressBarRect(
      progressBarContainerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      }
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("handleMouseMove");
    if (!isDragging) return;
    let newButtonLeft = e.clientX - progressBarRect.left - dragOffsetX;
    console.log("newButtonLeft", newButtonLeft);
    console.log("progressBarRect.left", progressBarRect.left);
    console.log("dragOffsetX", dragOffsetX);

    if (newButtonLeft < 0) {
      newButtonLeft = 0;
    } else if (newButtonLeft > progressBarRect.width) {
      newButtonLeft = progressBarRect.width;
    }

    const progress = newButtonLeft / progressBarRect.width;
    console.log("progressBarRect.width", progressBarRect.width);
    console.log("progress", progress);
    updateProgressBar(progress);

    const newIndex = Math.floor(progress * (data.length - 1)) + 1;
    console.log("newIndex", newIndex);
    if (newIndex > 0 && newIndex < data.length) {
      setCurrentIndex(newIndex);
      setLastIndex(newIndex - 1);
      const point = data[newIndex];
      const scaledX = (point.x - minX) * scale + offsetX;
      const scaledY = (point.y - minY) * scale + offsetY;
      drawPoint(scaledX, scaledY, "HAM", "red");
      const elapsedTime = new Date(data[newIndex].date).getTime() - startTime; // 转换为秒
      updateTimeDisplay(elapsedTime);
    }
  };

  const handleMouseUp = () => {
    console.log("handleMouseUp");
    setIsDragging(false);
  };

  const handleStartButtonClick = () => {
    console.log("handleStartButtonClick");
    if (isPaused) {
      console.log("handleStartButtonClick-start");
      if (startButtonRef.current) {
        startButtonRef.current.textContent = "Restart";
      }
      if (pauseButtonRef.current) {
        pauseButtonRef.current.textContent = "Pause";
      }
      console.log("data", data);
      if (currentIndex >= data.length) {
        setCurrentIndex(1);
        setLastIndex(0);
        setLastUpdateTime(0);

        // reset cumulative distances
        Object.keys(allDriversLocationData).forEach(driverNumber => {
          cumulativeDistancesRef.current[parseInt(driverNumber)] = 0;
        });
        setCurrentRanks([]);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `0%`;
        }
        if (progressButtonRef.current) {
          progressButtonRef.current.style.left = `0%`;
        }
        setCurrentTime(0);
      }
      setLastUpdateTime(performance.now());
      setIsPaused(false);
    } else {
      console.log("handleStartButtonClick-restart");
      if (startButtonRef.current) {
        startButtonRef.current.textContent = "Start";
      }
      if (pauseButtonRef.current) {
        pauseButtonRef.current.textContent = "Pause";
      }
      setCurrentIndex(1);
      setLastIndex(0);
      setLastUpdateTime(0);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `0%`;
      }
      if (progressButtonRef.current) {
        progressButtonRef.current.style.left = `0%`;
      }
      setCurrentTime(0);
      setIsPaused(true);
    }
  };

  const handlePauseButtonClick = () => {
    if (!isPaused) {
      setIsPaused(true);
      if (pauseButtonRef.current) {
        pauseButtonRef.current.textContent = "Resume";
      }
    } else {
      if (currentIndex < data.length) {
        setIsPaused(false);
        if (pauseButtonRef.current) {
          pauseButtonRef.current.textContent = "Pause";
        }
        setLastUpdateTime(performance.now());
      } else {
        alert("Game finished, please click 'Restart'");
      }
    }
  };

  return {
    loading,
    canvasRef,
    canvasBgRef,
    progressBarContainerRef,
    progressBarRef,
    progressButtonRef,
    startButtonRef,
    pauseButtonRef,
    currentTimeDisplayRef,
    totalTimeDisplayRef,
    handleStartButtonClick,
    handlePauseButtonClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentRanks
  };
};

export default useCanvasAnimation;

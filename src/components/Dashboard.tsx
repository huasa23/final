import styled from "styled-components";
import useCanvasAnimation from "./RaceAnimationHook";
import { useParams } from "react-router-dom";
import CarStatBar from "./CarStatBar.tsx";

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const RankingWrapper = styled.div`
  width: 20%;
  height: 80vh;
  border: 1px solid black;
`;
const MapWrapper = styled.div`
  width: 79%;
  margin-left: 1%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  
`;
const CanvasWrapper = styled.div`
  width: 100%;
  height: 90%;
  
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: auto;
`;
const ProgressWrapper = styled.div`
  width: 100%;
  height: 10%;
  
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const ControlsWrapper = styled.div`
  width: 10%;
  height: 100%;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const LoadingWrapper = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
`;
const ControlButton = styled.button`
  width: 80%;
  height: 30%;
  margin: auto;
  border-radius: 10px;
  border: 1px solid black;
  background-color: black;
  color: white;
`;
const ProgressContainer = styled.div`
  position: relative;
  width: 80%; 
  height: 1vh;
  margin: auto; 
  background-color: #eee;
`;
const ProgressBar = styled.div`
  height: 100%;
  width: 0%; 
  background-color: black;
`;
const ProgressButton = styled.div`
  position: absolute; 
  top: -0.5vw; 
  left: 0%; 
  width: 2vw;
  height: 2vw;
  background-color: black;
  border-radius: 50%; 
  cursor: grab; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); 
  &:active {
    cursor: grabbing; 
  }
`;

const TimeDisplay = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: black;
`;

export default function Dashboard() {
  const params = useParams<{sessionId: string}>();

  const {
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
  } = useCanvasAnimation(params.sessionId as string);

  return (
    <>
      <DashboardWrapper>
        <RankingWrapper></RankingWrapper>
        <MapWrapper>
          <CanvasWrapper>
           
            <Canvas ref={canvasBgRef} width="700" height="700"></Canvas>
            <Canvas ref={canvasRef} width="700" height="700"></Canvas>
           
          </CanvasWrapper>
          {loading ? (<LoadingWrapper>Loading...</LoadingWrapper>) :
          (<ProgressWrapper>
            
            <ControlsWrapper>
              <ControlButton ref={startButtonRef} onClick={handleStartButtonClick}>Start</ControlButton>
              <ControlButton ref={pauseButtonRef} onClick={handlePauseButtonClick}>Pause</ControlButton>
            </ControlsWrapper>
            <ProgressContainer ref={progressBarContainerRef}>
              <ProgressBar ref={progressBarRef}></ProgressBar>
              <ProgressButton ref={progressButtonRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          ></ProgressButton>
            </ProgressContainer>
            <TimeDisplay>
              <span ref={currentTimeDisplayRef}>00:00</span>
              <span>/</span>
              <span ref={totalTimeDisplayRef}>00:00</span>
            </TimeDisplay>
          </ProgressWrapper>)}
        </MapWrapper>
        <CarStatBar timeRef={currentTimeDisplayRef}/>
      </DashboardWrapper>
    </>
  );
}

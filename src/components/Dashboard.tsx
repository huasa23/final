import styled from "styled-components";
import useCanvasAnimation from "./RaceAnimationHook";
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
  border: 1px solid black;
`;
const CanvasWrapper = styled.div`
  width: 100%;
  height: 90%;
  border: 1px solid black;
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
  border: 1px solid black;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const ControlsWrapper = styled.div`
  width: 10%;
  height: 100%;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ControlButton = styled.button`
  width: 80%;
  height: 30%;
  margin: auto;
  border: 1px solid black;
  background-color: steelblue;
`;
const ProgressContainer = styled.div`
  position: relative; /* 相对定位，为了按钮绝对定位 */
  width: 80%; /* 进度条宽度 */
  height: 1vh;
  margin: auto; /* 居中显示 */
  background-color: #eee;
`;
const ProgressBar = styled.div`
  height: 100%;
  width: 0%; /* 初始进度为0 */
  background-color: steelblue;
`;
const ProgressButton = styled.div`
  position: absolute; /* 绝对定位在进度条上 */
  
  top: -0.5vw; /* 向上偏移一点，使其居中在进度条线上 */
  left: 0%; /* 初始位置在最左侧 */
  width: 2vw;
  height: 2vw;
  background-color: steelblue;
  border-radius: 30%; /* 圆形按钮 */
  cursor: grab; /* 鼠标悬停时显示抓取光标 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* 阴影效果 */
  &:active {
    cursor: grabbing; /* 鼠标点击时显示抓取中光标 */
  }
`;

const TimeDisplay = styled.div`
  width: 10%;
  height: 100%;
  border: 1px solid black;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #555;
`;

export default function Dashboard() {
  

  const {
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
  } = useCanvasAnimation();

  return (
    <>
      <DashboardWrapper>
        <RankingWrapper></RankingWrapper>
        <MapWrapper>
          <CanvasWrapper>
           
            <Canvas ref={canvasBgRef} width="700" height="700"></Canvas>
            <Canvas ref={canvasRef} width="700" height="700"></Canvas>
           
          </CanvasWrapper>
          <ProgressWrapper>
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
          </ProgressWrapper>
        </MapWrapper>
      </DashboardWrapper>
    </>
  );
}

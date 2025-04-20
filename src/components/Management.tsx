import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
const ManagementWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ManagementItem = styled.div`
  flex-basis: calc(20% - 10px); /* 设置每个网格项的宽度，这里假设每行 3 个，并减去间距 */
  flex-grow: 0; /* 不允许伸展 */
  flex-shrink: 0; /* 不允许收缩 */
  margin: 5px; /* 网格项之间的间距 */
  height: 100px; /* 设置高度，方便查看 */
  border: 1px solid #ddd;
  box-sizing: border-box; /* 保证 padding 和 border 不会撑大元素 */
  display: flex; /* 可以让内容居中 */
  flex-direction: column;
  border-radius: 10px;
`;

const SeasonCountryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 10%;
`;

const Season = styled.div`
  font-size: 38px;
  font-weight: bold;
  font-family: "Monoton", sans-serif;
  font-weight: 400;
  font-style: normal;
  margin-right: auto;
`;  

const Country = styled.div`
  font-size: 32px;
  font-weight: bold;
  font-family: "Anton", sans-serif;
  font-weight: 400;
  font-style: normal;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const SessionTypeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 10%;
`;

const SessionType = styled.div`
  font-size: 16px;
  font-family: "Oxanium", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: italic;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const SessionLink = styled(Link)`
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  
`;
const SessionPlayButton = styled.button`
  background-color: transparent; /* 背景透明 */
  border: 1px solid #333; /* 边框 */
  width: 50px; /* 按钮宽度 */
  height: 30px; /* 按钮高度 */
  border-radius: 10px; /* 圆角，使其变成圆形 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-family: "Play", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
`;
export default function Management() {
  const [managementItems, setManagementItems] = useState([
    {
      season: "2025",
      country_key: "MEX",
      sessionid: "9181",
      session_type_name: "Practice",
    },
    {
      season: "2025",
      country_key: "USA",
      sessionid: "9182",
      session_type_name: "Race",
    },
    {
      season: "2024",
      country_key: "CAN",
      sessionid: "9183",
      session_type_name: "Qualifying",
    },
    {
      season: "2024",
      country_key: "BRA",
      sessionid: "9184",
      session_type_name: "Practice",
    },
    {
      season: "2024",
      country_key: "BRA",
      sessionid: "9185",
      session_type_name: "Practice",
    },
  ]);

  // useEffect(() => {
  //   async function fetchData(): Promise<void> {
  //       const url = "https://127.0.0.1/gamelist";
  //       let rawData = await fetch(url);
  //       const {data} = await rawData.json();
  //       setManagementItems(data);
  //   }
  //   fetchData()
  //       .then(() => console.log("Data fetched successfully"))
  //       .catch((e: Error) => console.log("There was the error: " + e));
  // }, []);
  
  return (
    <>
    <ManagementWrapper>
      {managementItems.map((item) => (
        <ManagementItem key={item.sessionid}>
          <SeasonCountryWrapper>
            <Season>{item.season}</Season>
            <Country>{item.country_key}</Country>
          </SeasonCountryWrapper>
          <SessionTypeWrapper>
          <SessionType>{item.session_type_name}</SessionType>
          <SessionLink to={`/session/${item.sessionid}`}><SessionPlayButton>Play</SessionPlayButton></SessionLink>
          
          </SessionTypeWrapper>
        </ManagementItem>
      ))}
    </ManagementWrapper>
    </>
  )
}
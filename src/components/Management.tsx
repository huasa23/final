import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
const ManagementWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 80vh;
  
`;

const ManagementItem = styled.div`
  flex-basis: calc(20% - 10px); 
  flex-grow: 0; 
  flex-shrink: 0; 
  margin: 5px; 
  height: 100px; 
  border: 1px solid #ddd;
  box-sizing: border-box;
  display: flex; 
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
  background-color: transparent; 
  border: 1px solid #333; 
  width: 50px; 
  height: 30px; 
  border-radius: 10px; 
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-family: "Play", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
`;
export default function Management() {
  const [managementItems] = useState([
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
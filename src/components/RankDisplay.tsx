/**
 * Display the rank in real-time
 * @author Zihao Qian
 * */
import React from "react";
import styled from "styled-components";

interface DisplayRank {
    driverNumber: number;
    distance: number;
}

interface RankDisplayProps {
    ranks: DisplayRank[];
}

/**
 * UI for the rank display
 **/
const Container = styled.div`
    padding: 1rem;
    font-family: 'Orbitron', sans-serif;
    background: linear-gradient(135deg, #000000, #203a43, #2c5364);
    color: #00e6e6;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
`;
const RankList = styled.ol`
    list-style: none;
    padding: 0;
    margin: 0;
`;
const RankItem = styled.li`
    font-size: 0.8rem;
    background: rgba(0, 255, 255, 0.1);
    border-left: 4px solid #00e6e6;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
   
    transition: transform 0.2s ease;

    &:hover {
        transform: translateX(5px);
        background: rgba(0, 255, 255, 0.2);
    }
`;
/**
 * Display the rank in real-time
 *
 **/
export const RankDisplay: React.FC<RankDisplayProps> = ({ranks}) => {
    return (
        <Container>
            <div className="rank-display" >
                <h2>Real-time Ranking</h2>
                <RankList>

                    {ranks.map((rank, index) => (
                        <RankItem>
                            #{index + 1} - Driver {rank.driverNumber}
                        </RankItem>
                    ))}

                </RankList>
            </div>
        </Container>
    );
};
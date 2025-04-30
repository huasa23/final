/**
 * Display the rank in real-time
 * @author Zihao Qian
 * */
import React from "react";

interface DisplayRank   {
    driverNumber: number;
    distance: number;
}
interface RankDisplayProps {
    ranks: DisplayRank[];
}

/**
 * Display the rank in real-time
 *
 **/
export const RankDisplay: React.FC<RankDisplayProps> = ({ ranks }) => {
    return (
        <div className="rank-display" style={{padding: "1rem" }}>
            <h2>Real-time Ranking</h2>
            <ol >
                {ranks.map((rank, index) => (
                    <li>
                        #{index + 1} - Driver {rank.driverNumber}
                    </li>
                ))}
            </ol>
        </div>
    );
};
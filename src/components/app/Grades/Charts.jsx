
import { useState, useEffect, useRef } from "react";
// import { Chart } from 'chart.js';


import "./Charts.css";
import DropDownMenu from "../../generic/UserInputs/DropDownMenu";


export default function Charts({ sortedGrades }) {
    /**
     * Charts types:
     * 0: General average + streak history | line
     * 1: Subjects average | bar
     * 2: Subjects average | radar
     */

    // States
    const [chartType, setChartType] = useState(0);

    const chartRef = useRef(null);


    useEffect(() => {
        console.log(chartType)
    }, [chartType])


    function chartTypeToDataset() {
        /**
         * return the appropriate dataset according to the chartType
         */

        switch (chartType) {
            case 0:
                // General average + streak history | line
                break;

            case 1:
                // Subjects average | bar

                break;

            case 2:
                // Subjects average | radar
                break;

            default:
                break;
        }
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },

        },
    };

    const data = {
        datasets: [
            {
                label: "Moyenne générale",
                data: Array.from({ length: 5 }, () => Math.random() * 20),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: "Score de Streak",
                data: Array.from({ length: 5 }, () => Math.random() * 20),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const buildChart = () => {
        console.log("Building chart...")
        const ctx = chartRef.current.getContext("2d");
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.async = true;
        script.onload = buildChart

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);
    
    // JSX
    return (
        <div className="graphics">
            <div className="top-container">
                <DropDownMenu name="chart-type" options={[0, 1, 2]} displayedOptions={["Moyenne générale Courbe", "Moyennes par matière Barres", "Moyennes par matière Radar"]} selected={chartType} onChange={(value) => setChartType(parseInt(value))} />
                <h3>Graphiques</h3>
                <div className="artificial-horizontal-center"></div>
            </div>
            <div className="chart-container">
                <canvas ref={chartRef} height="600"></canvas>
            </div>
        </div>
    )
}

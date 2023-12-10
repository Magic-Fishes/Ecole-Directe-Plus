
import { useState, useEffect, useRef, useContext } from "react";
// import { Chart } from 'chart.js';


import "./Charts.css";
import DropDownMenu from "../../generic/UserInputs/DropDownMenu";


import { AppContext } from "../../../App";

export default function Charts({ selectedPeriod }) {
    /**
     * Charts types:
     * 0: General average + streak history | line
     * 1: Subjects average | bar
     * 2: Subjects average | radar
     */

    // States
    const [chartType, setChartType] = useState(0);

    const chartContainerRef = useRef(null);
    const chart = useRef(null);
    const chartOptions = useRef(null);
    const chartData = useRef(null);

    const { activeAccount, useUserData, actualDisplayTheme } = useContext(AppContext);
    const userData = useUserData();

    const generalAverageHistory = userData.get("generalAverageHistory");
    const streakScoreHistory = userData.get("streakScoreHistory");

    useEffect(() => {
        const resizeChart = () => {
            chartContainerRef.current.height = document.getElementById("charts")?.getBoundingClientRect().height - document.querySelector("#charts > .top-container")?.getBoundingClientRect().height;
        }

        window.addEventListener("resize", resizeChart);
        resizeChart();

        return () => {
            window.removeEventListener("resize", resizeChart);
        }
    }, [])


    function getChartData() {
        /**
         * return the appropriate dataset according to the chartType
         */

        switch (chartType) {
            case 0:
                // General average + streak history | line
                chartOptions.current = {
                    scales: {
                        y: {
                            // beginAtZero: true,
                            suggestedMax: 20
                        }
                    },
                };
                chartData.current = {
                    labels: Array.from({ length: generalAverageHistory[selectedPeriod].dates.length }, (_, i) => generalAverageHistory[selectedPeriod].dates[i].toLocaleDateString(navigator.language || "fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })),
                    datasets: [
                        {
                            label: "Moyenne générale",
                            data: generalAverageHistory[selectedPeriod].generalAverages,
                            orderWidth: 1,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            tension: 0.2
                        },
                        {
                            label: "Score de Streak",
                            data: streakScoreHistory[selectedPeriod],
                            orderWidth: 1,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            tension: 0.2
                        },
                    ],
                };
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



    
    /*
    {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    }
    */

    const buildChart = () => {
        console.log("Building chart...");
        getChartData();
        const ctx = chartContainerRef.current.getContext("2d");
        Chart.defaults.color = actualDisplayTheme == "dark" ? "rgb(180, 180, 240)" : "rgb(76, 76, 184)";
        chart.current = new Chart(ctx, {
            type: 'line',
            data: chartData.current,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
                ...chartOptions.current
            }
        });

        return chart;
    }

    function refreshChart() {
        if (chart.current) {
            chart.current.destroy();
            buildChart();
        }
    }

    useEffect(() => {
        console.log(chartType);
        refreshChart();
    }, [chartType, activeAccount, selectedPeriod]);

    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.async = true;
        script.onload = buildChart;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    // JSX
    return (
        <div id="charts">
            <div className="top-container">
                <DropDownMenu name="chart-type" options={[0, 1, 2]} displayedOptions={["Moyenne générale Courbe", "Moyennes par matière Barres", "Moyennes par matière Radar"]} selected={chartType} onChange={(value) => setChartType(parseInt(value))} />
                <h3>Graphiques</h3>
                <div className="artificial-horizontal-center"></div>
            </div>
            <div id="chart-container">
                <canvas ref={chartContainerRef}></canvas>
            </div>
        </div>
    )
}


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
    const canvasContainerRef = useRef(null);
    const chart = useRef(null);
    const chartOptions = useRef(null);
    const chartData = useRef(null);

    const { activeAccount, useUserData, actualDisplayTheme } = useContext(AppContext);
    const userData = useUserData();

    const generalAverageHistory = userData.get("generalAverageHistory");
    const streakScoreHistory = userData.get("streakScoreHistory");
    const subjectsComparativeInformation = userData.get("subjectsComparativeInformation");

    const resizeChart = () => {
        chartContainerRef.current.height = document.getElementById("charts")?.getBoundingClientRect().height - document.querySelector("#charts > .top-container")?.getBoundingClientRect().height;
    }

    useEffect(() => {

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
                            type: 'linear',
                            display: true,
                            position: 'left',
                            suggestedMax: 20
                        },
                        // y1: {
                        //     type: 'linear',
                        //     display: true,
                        //     position: 'right',
                        //     suggestedMax: 20
                        // }
                        // xAxes: [{
                        //     type: 'time',
                        //     ticks: {
                        //         autoSkip: true,
                        //         maxTicksLimit: 20
                        //     }
                        // }]
                    },
                    interaction: {
                        mode: "index",
                        intersect: false,
                    },
                };
                chartData.current = {
                    labels: Array.from({ length: generalAverageHistory[selectedPeriod].dates.length }, (_, i) => generalAverageHistory[selectedPeriod].dates[i].toLocaleDateString(navigator.language || "fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })),
                    datasets: [
                        {
                            type: "line",
                            label: "Moyenne générale",
                            data: generalAverageHistory[selectedPeriod].generalAverages,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            tension: 0.2,
                            // yAxisID: "y"
                        },
                        {
                            type: "line",
                            label: "Score de Streak",
                            data: streakScoreHistory[selectedPeriod],
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            tension: 0.2,
                            // yAxisID: "y1"
                        },
                    ],
                };
                break;

            case 1:
                // Subjects average | bar
                chartOptions.current = {
                    scales: {
                        y: {
                            type: 'linear',
                            beginAtZero: true,
                            display: true,
                            position: 'left',
                            suggestedMax: 20
                        },
                    },
                    interaction: {
                        mode: "index",
                        intersect: false,
                    },
                };
                chartData.current = {
                    labels: Array.from({ length: subjectsComparativeInformation[selectedPeriod].length }, (_, i) => subjectsComparativeInformation[selectedPeriod][i].subjectFullname),
                    datasets: [
                        // {
                        //     type: "bar",
                        //     label: "Moyennes min et max de classe",
                        //     base: subjectsComparativeInformation[selectedPeriod].map((subject) =>  subject.minAverage),
                        //     // base: function (context) {
                        //     //     console.log("context:", context);
                        //     // },
                        //     data: subjectsComparativeInformation[selectedPeriod].map((subject) =>  subject.maxAverage),
                        //     borderWidth: 2,
                        //     borderRadius: 7,
                        //     borderColor: 'rgb(53, 162, 235)',
                        //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        //     // yAxisID: "y"
                        //     borderSkipped: false,
                        //     order: 2
                        // },
                        {
                            type: "line",
                            label: "Moyennes élève",
                            data: subjectsComparativeInformation[selectedPeriod].map((subject) => subject.average),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            tension: 0.2,
                            // yAxisID: "y1"
                            order: 0,
                        },
                        {
                            type: "line",
                            label: "Moyennes classe",
                            data: subjectsComparativeInformation[selectedPeriod].map((subject) => subject.classAverage),
                            borderColor: 'rgb(24, 24, 41)',
                            backgroundColor: 'rgba(24, 24, 41, 0.5)',
                            tension: 0.2,
                            // yAxisID: "y1"
                            order: 1,
                        },
                        {
                            type: "line",
                            label: "Moyennes max classe",
                            data: subjectsComparativeInformation[selectedPeriod].map((subject) => subject.maxAverage),
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            tension: 0.2,
                            // yAxisID: "y1"
                            order: 2,
                        },
                        {
                            type: "line",
                            label: "Moyennes min classe",
                            data: subjectsComparativeInformation[selectedPeriod].map((subject) => subject.minAverage),
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            tension: 0.2,
                            // yAxisID: "y1"
                            order: 3,
                        },
                    ],
                };
                break;

            case 2:
                // Subjects average | radar
                chartOptions.current = {
                    scales: {
                        r: {
                            ticks: {
                                showLabelBackdrop: false,
                                z: 1
                            },
                            beginAtZero: true,
                            suggestedMax: 20,
                            grid: {
                                color: actualDisplayTheme == "dark" ? "rgba(180, 180, 240, .4)" : "rgba(76, 76, 184, .4)"
                            }
                        }
                    },
                    interaction: {
                        axis: "xy",
                        mode: "index",
                        intersect: false,
                    },
                };
                chartData.current = {
                    labels: Array.from({ length: subjectsComparativeInformation[selectedPeriod].length }, (_, i) => subjectsComparativeInformation[selectedPeriod][i].subjectFullname),
                    datasets: [
                        {
                            type: "radar",
                            label: "Moyennes élève",
                            data: subjectsComparativeInformation[selectedPeriod].map((subject) => subject.average),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            order: 0,
                        },
                        {
                            type: "radar",
                            label: "Moyennes classe",
                            data: subjectsComparativeInformation[selectedPeriod].map((subject) => subject.classAverage),
                            borderColor: 'rgb(24, 24, 41)',
                            backgroundColor: 'rgba(24, 24, 41, 0.2)',
                            order: 1,
                        },
                    ],
                };
                break;

            default:
                break;
        }
    }

    const buildChart = () => {
        console.log("Building chart...");
        getChartData();
        const ctx = chartContainerRef.current.getContext("2d");
        Chart.defaults.color = actualDisplayTheme == "dark" ? "rgb(180, 180, 240)" : "rgb(76, 76, 184)";
        chart.current = new Chart(ctx, {
            data: chartData.current,
            options: {
                animation: {
                    duration: 0, // general animation time
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        backgroundColor: actualDisplayTheme == "dark" ? "rgba(24, 24, 41, .8)" : "rgba(228, 228, 255, .8)",
                        cornerRadius: 10,
                        padding: 10,
                        boxPadding: 4,
                        bodySpacing: 6,
                        titleColor: actualDisplayTheme == "dark" ? "white" : "black",
                        bodyColor: actualDisplayTheme == "dark" ? "white" : "black",
                        footerColor: actualDisplayTheme == "dark" ? "white" : "black"
                    }
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
                <DropDownMenu name="chart-type" options={[0, 1, 2]} displayedOptions={["Moyenne générale Courbe", "Moyennes par matière Courbes", "Moyennes par matière Radar"]} selected={chartType} onChange={(value) => setChartType(parseInt(value))} />
                <h3>Graphiques</h3>
                <div className="artificial-horizontal-center"></div>
            </div>
            <div id="canvas-container" ref={canvasContainerRef}>
                <canvas id="chart-container" ref={chartContainerRef}></canvas>
            </div>
        </div>
    )
}

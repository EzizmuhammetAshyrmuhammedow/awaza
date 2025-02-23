import Chart from "chart.js/auto";

export function createChart(canvas, data) {
    new Chart(canvas, {
        type: "bar",
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: data.label,
                    data: data.values,
                    backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
                },
            ],
        },
    });
}

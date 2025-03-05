import Chart from 'chart.js/auto';

document.addEventListener('turbo:load', () => {
    const ctx = document.getElementById('myChart');
    if (!ctx) return; // Prevent errors if the element doesn't exist

    new Chart(ctx, {
        type: 'bar', // 'line', 'pie', 'doughnut', etc.
        data: {
            labels: ['Red', 'Blue', 'Yellow'],
            datasets: [{
                label: 'Votes',
                data: [12, 19, 3],
                backgroundColor: ['red', 'blue', 'yellow']
            }]
        }
    });
});

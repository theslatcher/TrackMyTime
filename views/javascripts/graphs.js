const testData = {
  labels: ['Study', 'Games', 'Movies', 'Cooking', 'Workout', 'Sleep'],
  datasets: [32, 12, 15, 10, 20, 5],
  colors: ['#00bcd4', '#ff9800', '#9c27b0', '#009688', '#4caf50', '#795548']
}

const data = {
  labels: testData.labels,
  datasets: [
    {
      label: "Summarization of total time in every ",
      borderColor: testData.colors, // line color
      backgroundColor: testData.colors, // fill color
      data: testData.datasets
    },
  ],
};

const config = {
  type: "pie",
  data: data,
  options: {
    responsive: true,
    title: {
      display: true,
      text: "jdfhgkjdfhgjkdf",
      color: "#fff"
    },
    tooltips: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
  },
};

const myChart = new Chart(document.getElementById("chart-pie-summary"), config);

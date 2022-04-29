const testData = {
  labels: ['Study', 'Games', 'Movies', 'Cooking', 'Workout', 'Sleep'],
  datasets: [32, 12, 15, 10, 20, 5],
  colors: ['#00bcd4', '#ff9800', '#9c27b0', '#009688', '#4caf50', '#795548']
}

const userData = "testuser";


function fetchTrackerTask(user) {
  return new Promise((resolve, reject) => {
    fetch(`/task/user/${user}`)
      .then(res => res.json())
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function formatData(data) {
  let labels = [];
  let datasets = [];
  let colors = [];
  data.forEach(task => {
    labels.push(task.name);
    datasets.push(task.currenttime);
    colors.push(task.color);
  });
  return {
    labels: labels,
    datasets: datasets,
    colors: colors
  };
}

function createPie(d, i, title) {
  const data = {
    labels: d.labels,
    datasets: [
      {
        label: "Summarization of total time in every ",
        borderColor: d.colors, // line color
        backgroundColor: d.colors, // fill color
        data: d.datasets
      },
    ],
  };
  
  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      plugins: {
        title: {
          display: true,
          text: title,
          color: '#d3d1d1',
          font: {
            size: 18,
          },
        },
      },
    },
  };
  const myChart = new Chart(document.getElementById("chart-pie" + i), config);
}

fetchTrackerTask(userData).then(data => {
  return formatData(data);
}).then(data => {
  createPie(data, 1, "Summarization of total time in every task");
});

document.getElementById("graph-container").innerHTML = '<canvas id="chart-pie1" class="graph-canvas"></canvas>';
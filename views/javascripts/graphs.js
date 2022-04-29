const testData = {
  labels: ['Study', 'Games', 'Movies', 'Cooking', 'Workout', 'Sleep'],
  datasets: [32, 12, 15, 10, 20, 5],
  colors: ['#00bcd4', '#ff9800', '#9c27b0', '#009688', '#4caf50', '#795548']
}

const userData = "testuser";


function fetchTrackerTask(user) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/task/user/${user}`)
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

function createPie(d, i) {
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
  console.log("done!");
  const myChart = new Chart(document.getElementById("chart-pie" + i), config);
}

var totalData = fetchTrackerTask(userData)
totalData = totalData.then(data => {
  return formatData(data);
});
console.log(totalData);

//wait for the promise to resolve
totalData.then(data => {
  createPie(data, 1);
});

document.getElementById("graph-container").innerHTML = '<canvas id="chart-pie1" class="graph-canvas"></canvas>';
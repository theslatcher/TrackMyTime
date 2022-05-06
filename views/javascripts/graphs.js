const testData = {
  labels: ["Study", "Games", "Movies", "Cooking", "Workout", "Sleep"],
  datasets: [32, 12, 15, 10, 20, 5],
  colors: ["#00bcd4", "#ff9800", "#9c27b0", "#009688", "#4caf50", "#795548"],
};

let chartAmount = 0;
let trackerIds = ["107", "103"];
const userData = "16";

function fetchTrackerTask(user) {
  return new Promise((resolve, reject) => {
    fetch(`/task/user/${user}`)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function fetchTimeTracker(id) {
  return new Promise((resolve, reject) => {
    fetch(`/time/${id}`)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function formatData(data) {
  let labels = [];
  let datasets = [];
  let colors = [];
  data.forEach((task) => {
    labels.push(task.name);
    datasets.push(task.currenttime);
    colors.push(task.color);
  });
  return {
    labels: labels,
    datasets: datasets,
    colors: colors,
  };
}

function formatTime(data) {
  let labels = [];
  let datasets = [];
  let colors = [];
  console.log(data);
  let color = "#00bcd4";
  data.forEach((time) => {
    labels.push(time.dayofyear);
    datasets.push(time.totaltime);

    colors.push(color);
  });
  return {
    labels: labels,
    datasets: datasets,
    colors: colors,
  };
}

function createPie(d, i, title) {
  let data = {
    labels: d.labels,
    datasets: [
      {
        label: "Summarization of total time in every ",
        borderColor: d.colors, // line color
        backgroundColor: d.colors, // fill color
        data: d.datasets,
      },
    ],
  };

  let config = {
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
          color: "#d3d1d1",
          font: {
            size: 18,
          },
        },
      },
    },
  };
  let myChart = new Chart(document.getElementById("chart-pie" + i), config);
}

function createLine(d, i, title) {
  let data = {
    labels: d.labels,
    datasets: [
      {
        label: "Hours",
        borderColor: d.colors, // line color
        backgroundColor: d.colors, // fill color
        data: d.datasets,
      },
    ],
  };

  let config = {
    type: "line",
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
          color: "#d3d1d1",
          font: {
            size: 18,
          },
        },
      },
    },
  };
  let myChart = new Chart(document.getElementById("chart-pie" + i), config);
}
fetchTrackerTask(userData)
  .then((data) => {
    return formatData(data);
  })
  .then((data) => {
    createPie(data, ++chartAmount, "Summarization of total time in every task");
  });

// makes a line graph for each task that the user has
for (let i = 0; i < trackerIds.length; i++) {
  fetchTimeTracker(trackerIds[i])
    .then((data) => {
      return formatTime(data);
    })
    .then((data) => {
      console.log(data);
      createLine(
        data,
        ++chartAmount,
        "Summarization of total time in " + trackerIds[i]
      );
    }).then(() => {
      let canvas = ``;
      for (let i = 1; i < chartAmount; ++i) {
        canvas += `<canvas id="chart-pie${i} class="graph-canvas"></canvas>`;
      }
      document.getElementById("graphs").innerHTML += canvas;
    }
    );
}

document.getElementById("graph-container").innerHTML =
  '<canvas id="chart-pie1" class="graph-canvas"></canvas>';

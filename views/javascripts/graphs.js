const testData = {
  labels: ["Study", "Games", "Movies", "Cooking", "Workout", "Sleep"],
  datasets: [32, 12, 15, 10, 20, 5],
  colors: ["#00bcd4", "#ff9800", "#9c27b0", "#009688", "#4caf50", "#795548"],
};
const testDataL1 = {
  labels: [
    "2022-05-01",
    "2022-05-02",
    "2022-05-03",
    "2022-05-04",
    "2022-05-05",
    "2022-05-06",
    "2022-05-07",
    "2022-05-08",
    "2022-05-09",
  ],
  datasets: [1.01666666666667, 1, 0.966666666666667, 1.8166666666666667, 0.4, 3.2, 2.5, 2.3, 1.5],
  colors: ["#00bcd4", "#00bcd4", "#00bcd4", "#00bcd4", "#00bcd4", "#00bcd4", "#00bcd4", "#00bcd4"],
}
const testDataL2 = {
  labels: [
    "2022-05-01",
    "2022-05-02",
    "2022-05-03",
    "2022-05-04",
    "2022-05-05",
  ],
  datasets: [2.14, 2.01666666666667, 5.966666666666667, 0.0166666666666667, 1],
  colors: ["#ff9800", "#ff9800", "#ff9800", "#ff9800", "#ff9800"],
};

let chartAmount = 0;
let trackerIds = [];
const userData = "";

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

function cfg(type, data, title) {
  return {
    type: type,
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
  let config = cfg("pie", data, title);
  new Chart(document.getElementById("chart" + i), config);
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
  let config = cfg("line", data, title);
  new Chart(document.getElementById("chart" + i), config);
}

function init() {
  fetchTrackerTask(userData)
    .then((data) => {
      return formatData(data);
    })
    .then((data) => {
      createPie(
        testData,
        chartAmount++,
        "Summarization of total time in every task"
      );
    })
    .catch((err) => {
      console.log(err);
    });

  // makes a line graph for each task that the user has
  for (let i = 0; i < trackerIds.length; i++) {
    fetchTimeTracker(trackerIds[i])
      .then((data) => {
        return formatTime(data);
      })
      .then((data) => {
        createLine(
          data,
          chartAmount++,
          "Summarization of total time in " + trackerIds[i]
        );
      })
      .then(() => {
        let canvas = ``;
        for (let i = 1; i < chartAmount; i++) {
          canvas += `<canvas id="chart${i} class="graph-canvas"></canvas>`;
        }
        document.getElementById("graphs").innerHTML += canvas;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// this is placeholder until I fix the data fetching
setTimeout(() => {
  createPie(testData, 0, "Summarization of total time in every task");
  createLine(testDataL1, 1, "Summarization of total time in something");
  createLine(testDataL2, 2, "Summarization of total time in something else");
}, 2000);

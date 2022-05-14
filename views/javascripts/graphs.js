var loadedOnce = false;
async function fetchTimeTracker(id) {
  return await fetch("/time/" + id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

// format tracker data for pie chart
function formatData(data) {
  let labels = [];
  let datasets = [];
  let colors = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].currenttime > 0) {
      labels.push(data[i].name);
      datasets.push(data[i].currenttime);
      colors.push(data[i].color);
    }
  }
  return {
    labels: labels,
    datasets: datasets,
    colors: colors,
  };
}

// format time data for line graph
function formatTimeData(data, color, title) {
  let labels = [];
  let datasets = [];
  let colors = [];
  let newtitle = "Summarization of hours spent on " + title;

  let tempTime = 0;
  for (let i = 0; i < data.length; i++) {
    tempTime += data[i].totaltime; // add up all the time (for a growing graph)
    if (labels.includes(data[i].dayofyear)) {
      // checks if the dates are the same
      datasets[labels.indexOf(data[i].dayofyear)] += data[i].totaltime;
    } else {
      labels.push(data[i].dayofyear);
      datasets.push(tempTime);
      colors.push(color);
    }
  }
  // if dataset has only one label add 0 to the front of datasets
  if (labels.length === 1) {
    datasets.unshift(0);
    labels.unshift("Start");
    colors.unshift(color);
  }
  return {
    labels: labels,
    datasets: datasets,
    colors: colors,
    title: newtitle,
  };
}

// this is the config/css for how the chart will look
function cfg(type, data, title, label) {
  let color = 'white'
  let grid_color = 'gray'
  let scales
  if (document.body.classList.contains('theme-light'))
    color = 'black'

  if (type === 'line')
    scales = {
      x: {
        grid: {
          color: grid_color,
          borderColor: grid_color
        }
      },
      y: {
        grid: {
          color: grid_color,
          borderColor: grid_color
        }
      }
    }

  return {
    type: type,
    data: data,
    options: {
      scales: scales,
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
        legend: {
          display: label
        },
        title: {
          display: true,
          text: title,
          color: color,
          font: {
            size: 18,
          }
        }
      }
    }

  }
}
function createPie(d, i, title) {
  let data = {
    labels: d.labels,
    datasets: [
      {
        borderColor: d.colors, // line color
        backgroundColor: d.colors, // fill color
        data: d.datasets,
      },
    ],
  };
  let config = cfg("pie", data, title, true);
  new Chart(document.getElementById("chart" + i), config);
}

function createLine(d, i, title) {
  let data = {
    labels: d.labels,
    datasets: [
      {
        borderColor: d.colors, // line color
        backgroundColor: d.colors, // fill color
        data: d.datasets,
      },
    ],
  };
  let config = cfg("line", data, title, false);
  new Chart(document.getElementById("chart" + i), config);
}

async function loadGraphs(user) {
  document.getElementById("graphs").innerHTML = ``;

  // fetch all user trackers
  const url = new URL(window.location.href + "task/user/" + user.userId);
  const res = await fetch(url);
  const trackers = await res.json();

  // if the data is saved in the local storage then load it
  if (loadedOnce && localStorage.getItem("pieData") && localStorage.getItem("lineData") && localStorage.getItem("trackerData") == JSON.stringify(trackers))
    await createCanvas(JSON.parse(localStorage.getItem("lineData")), JSON.parse(localStorage.getItem("pieData")));

  // arrays to store graph data
  let pieData = formatData(trackers);
  let lineData = [];

  // if the new data is different from the old data then createCanvas
  if (loadedOnce == false || localStorage.getItem("trackerData") !== JSON.stringify(trackers) || localStorage.getItem("trackerData") == null) {
    // fetch time data for each tracker
    for (let i = 0; i < trackers.length; i++) {
      let res = await fetchTimeTracker(trackers[i].trackerid);
      res = formatTimeData(res, trackers[i].color, trackers[i].name);
      lineData.push(res);
    }
    await createCanvas(lineData, pieData);
    loadedOnce = true;
    //console.log("graphs loaded from server");
  } else {
    //console.log("graphs loaded from local storage");
  }

  // save the tracker data since we can check if the currenttime has changed to fetch new data from the server
  localStorage.setItem("trackerData", JSON.stringify(trackers));
}

async function createCanvas(lineData, pieData) {
  let id = 0;
  // create empty graphs canvas
  let canvas = ``;

  // fill the canvas (+1 is the pie chart)
  for (let i = 0; i < lineData.length + 1; i++) {
    canvas += `<canvas id="chart${i}" class="graph-canvas"></canvas>`;
  }
  document.getElementById("graphs").innerHTML = canvas;

  // self explanatory
  createPie(
    pieData,
    id++,
    "Summarization of hours spent on each task"
  );

  // create line graphs
  for (let i = 0; i < lineData.length; i++) {
    createLine(
      lineData[i],
      id++,
      lineData[i].title
    );
  }

  // save pieData and lineData to local storage
  localStorage.setItem("pieData", JSON.stringify(pieData));
  localStorage.setItem("lineData", JSON.stringify(lineData));
}
// ⊂(　　⊂　　　_ω_　)⊃
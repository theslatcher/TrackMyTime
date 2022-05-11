let chartAmount = 0;
let trackerIds = [];
let userData = {};

async function fetchTimeTracker(id) {
  return await fetch("/time/" + id, {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    method: 'GET'
  })
  .then(res => res.json())
  .then(data => {
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
function formatTimeData(data, color) {
  let labels = [];
  let datasets = [];
  let colors = [];
  for (let i = 0; i < data.length; i++) {
    labels.push(data[i].dayofyear);
    datasets.push(data[i].totaltime);
    colors.push(color);
  }
  return {
    labels: labels,
    datasets: datasets,
    colors: colors,
  };
}

// this is the config/css for how the chart will look
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
        label: "Summarization of total time in every task",
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
        label: "Hours spent on each day",
        borderColor: d.colors, // line color
        backgroundColor: d.colors, // fill color
        data: d.datasets,
      },
    ],
  };
  let config = cfg("line", data, title);
  new Chart(document.getElementById("chart" + i), config);
}

async function loadGraphs(user) {
  // reset on load
  document.getElementById("graphs").innerHTML = ``;
  chartAmount = 0;
  userData = user;

  // fetch all user trackers
  const url = new URL(window.location.href + 'task/user/' + user.userId);
  const res = await fetch(url);
  const trackers = await res.json();

  // arrays to graph data store data
  let trackerTaskData = formatData(trackers)
  let trackerTimeData = []
  
  // fetch time data for each tracker
  for (let i = 0; i < trackers.length; i++) {
    const res = await fetchTimeTracker(trackers[i].trackerid)
    trackerTimeData.push(res)
  }
  
  // create graphs canvas
  let canvas = ``;
  for (let i = 0; i < trackerTimeData.length+1; i++) { // +1 is for the pie chart
    canvas += `<canvas id="chart${i}" class="graph-canvas"></canvas>`;
  }
  document.getElementById("graphs").innerHTML = canvas;
  
  // self explanatory
  createPie(
    trackerTaskData,
    chartAmount++,
    "Summarization of total time in every task"
  );

  // create line graphs
  for (let i = 0; i < trackerTimeData.length; i++) {
    let data = formatTimeData(trackerTimeData[i], trackers[i].color);
    createLine(
      data,
      chartAmount++,
      "Summarization of total time in " + trackers[i].name
    );
  }
}
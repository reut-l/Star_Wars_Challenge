// GENERAL HELPER FUNCIONTS
const getData = async (dataType) => {
  let nextPage = `https://swapi.dev/api/${dataType}/`;

  let allResults = [];

  while (nextPage) {
    const {
      data: { next, results },
    } = await axios.get(nextPage);

    nextPage = next;

    allResults = [...allResults, ...results];
  }

  return allResults;
};

/////////////////////////////////////// Task 1 ///////////////////////////////////
// HELPER FUNCTIONS
const printTable = (columnsTypes, contentArr, numberOfRows) => {
  let html = '<table>';

  html += '<tr>';
  for (let title of columnsTypes) {
    title = title.replace('_', ' ');
    html += `<th>${title}</th>`;
  }
  html += '</tr>';

  for (let i = 0; i < numberOfRows; i++) {
    html += '<tr>';
    for (let colType of columnsTypes) {
      html += `<td>${contentArr[i][colType]}</td>`;
    }
    html += '</tr>';
  }

  html += '</table>';
  return html;
};

// BODY
(async () => {
  //1. Get the data from the API
  let results1 = await getData('species');

  //2. Filter species which their lifespan isn't a number
  results1 = results1.filter((e) => isFinite(e.average_lifespan));

  //3. Sort the data
  results1.sort((a, b) => b.average_lifespan - a.average_lifespan);

  //4. Print the table
  const table = document.querySelector('#table');
  const columnsArr = ['name', 'classification', 'average_lifespan'];
  const tableHTML = printTable(columnsArr, results1, 3);
  table.innerHTML = tableHTML;
})().catch((err) => {
  console.log(err);
});

/////////////////////////////////////// Task 2 ///////////////////////////////////
const htmlTemplate =
  '<div class="bar-box"><div class="bar-name">{%POPULATION%}</div><div class="bar" id="bar-{%PLANET_NAME%}"></div><div class="bar-name">{%PLANET_NAME%}</div></div>';

(async () => {
  // HELPER FUNCTIONS
  const calcBarHight = (num, maxNum, chartSizeVH) => {
    return `${(num / maxNum) * chartSizeVH}vh`;
  };

  // BODY
  const planets = ['Bespin', 'Endor', 'Utapau', 'Kashyyyk', 'Mygeeto'];

  //1. Get the data from the API
  const results2 = await getData('planets');

  //2. Get the relevant data
  let data = [];
  results2.forEach((e) => {
    if (planets.includes(e.name)) {
      data.push({ name: e.name, population: e.population * 1 });
    }
  });

  //3. Get the largest bar and accordingly dinamically print the bar chart
  const largestPop = Math.max(...data.map((e) => e.population));
  const barChart = document.querySelector('#barChart');

  for (let planet of data) {
    let html = htmlTemplate.replace(
      '{%POPULATION%}',
      planet.population.toLocaleString()
    );
    html = html.replaceAll('{%PLANET_NAME%}', planet.name);
    barChart.innerHTML += html;

    const bar = document.querySelector(`#bar-${planet.name}`);
    bar.style.height = calcBarHight(planet.population, largestPop, 70);
  }
})().catch((err) => {
  console.log(err);
});

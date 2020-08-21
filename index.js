const advan = [
  {head: "Overall improvement of food hygiene and safety", value: 47},
  {head: "Assisting food business in complying with the law", value: 34},
  {head: "Added inspection capacity (private audits)", value: 25},
  {head: "Public controls can focus on high risks", value: 46},
  {head: "Increased confidence in the level of compliance through access to vTPA data", value: 27}
];

const disAdvan = [
  {head: "Private assurance systems are not reliable", value: 22},
  {head: "Conflicts with legal obligations", value: 23},
  {head: "Confidentiality of private audit reports", value: 26},
  {head: "Regulatory capture", value: 19},
  {head: "Undermines consumer confidence in government authorities", value: 24},
  {head: "Financial costs for food business operators", value: 34}
];

const svgWidth = 700;
const svgHeight = 430;

function draw(type){
  const title = `${type} of cooperation with vTPA programs`;
  const data = (type == "Advantages") ? advan : disAdvan;
  const sortedData = data.sort((a, b) => b.value - a.value);


  const margin = {
    top: 110,
    bottom: 10,
    left: 30,
    right: 20
  };

  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;
  const cellWidth = width/ 62;

  const cellData = Array.from(Array(62).keys()).map(d => d + 1);

  console.log(cellData);

  const scaleBand = d3.scaleBand()
    .domain(sortedData.map(d => d.head))
    .range([0, height]);

  const svgG = d3.select('svg.barCell')
                .append('g')
                .classed('barCellG', true)
                .attr('transform', `translate(${margin.left}, ${margin.top})`);


  const titleSel = svgG.append('text')
                    .text(title)
                    .attr('x', '0')
                    .attr('y', '-50px')
                    .styles({
                      'font-size': '22px'
                    })

  const categGroup = svgG.selectAll('g.categGroup')
                        .data(sortedData)
                        .enter()
                        .append('g')
                        .attr('class', 'categGroup')
                        .attr('transform', d => `translate(0, ${scaleBand(d.head)})`);

  const categText = categGroup.append('text')
                              .html(d => `
                                  <tspan class = "head">${d.head} </tspan>
                                  <tspan class = "value">- (<tspan class="valueNum">${0}</tspan>/ 62)</tspan>
                              `)
                              //.style('font-family', "'Roboto', sans-serif")
                              .style('font-size', "15px")
                              .style('fill-opacity', 0)
                              .transition()
                              .delay((d, i) => i * 500)
                              .duration(250)
                              .style('fill-opacity', 1);

  const vals = sortedData.map(d => d.value);

  d3.selectAll('tspan.valueNum')
    .transition()
    .delay((d, i) => i * 500)
    .duration(500)
    .textTween(function(d, i) {
          const int = d3.interpolate(0, vals[i]);
          return function(t) { return Math.round(int(t)); };
        });

  const barCellG = categGroup.append('g')
                        .attr('class', 'barCellG')
                        .attr('transform', d => `translate(0, 10)`);

  const cells = barCellG.selectAll('rect.cells')
                        .data((d, i) => cellDataGen(62, d.value, i))
                        .enter()
                        .append('rect')
                        .attr('class', 'cells')
                        .attrs({
                          x: (d, i) => i * cellWidth,
                          y: 0,
                          width: cellWidth - 1,
                          height: scaleBand.bandwidth()/2 - 2
                        })
                        .style('fill', '#eee')
                        //.style('fill-opacity', 0.5)
                        .transition()
                        .delay((d, i) => (i * 20) + (d.parentIdx * 500))
                        .duration(100)
                        .style('fill', d =>  d.colState ? '#BA68C8' : '#eee')
                        //.style('fill-opacity', 1);
}

function cellDataGen(totalLen, value, parentIdx){
  const arr = Array.from(Array(totalLen).keys()).map(d => d + 1);
  return arr.map(d => {
    return {
      parentIdx: parentIdx,
      idx: d,
      colState: (d > value) ? false : true
    }
  })
}

draw("Advantages");

d3.select('#reAnim').on('click', function(d, i){
  // remove everything
  d3.select('svg.barCell').selectAll("*").remove();

  draw("Advantages");

})

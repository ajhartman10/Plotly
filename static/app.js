function buildMetadata(sample) {
 // @TODO: Complete the following function that builds the metadata panel
  
 // Use `d3.json` to fetch the metadata for a sample
  var metadataurl = `/metadata/${sample}`;
  d3.json(metadataurl).then(function(sample){
 // Use d3 to select the panel with id of `#sample-metadata`
    var metadataselect = d3.select("#sample-metadata");
 //Test to if plotly works
    // Use `.html("") to clear any existing metadata
    metadataselect.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    console.log(Object.entries(data));
    Object.entries(sample).forEach(function ([key, value]) {
        var row = metadataselect.append("p");
        row.text(`${key}: ${value}`);
    });
 });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var samurl = `/samples/${sample}`;
    d3.json(samurl).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var trace10 = {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: 'markers',
        marker: {
            color: data.otu_ids,
            size: data.sample_values
        }
    };

    var data = [trace10];
    var layout = {
        xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot('bubble',data,layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    newFunction();
  }); 


    function newFunction() {
        d3.json(samurl).then(function (data) {
            var pie_value = data.sample_values.slice(0, 10);
            var pie_label = data.otu_ids.slice(0, 10);
            var pie_hover = data.otu_labels.slice(0, 10);
            var data = [{
                values: pie_value,
                labels: pie_label,
                hovertext: pie_hover,
                type: 'pie'
            }];
            Plotly.newPlot('pie', data);
        });
    }
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
init();
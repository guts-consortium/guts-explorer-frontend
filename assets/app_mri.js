/***********/
// Vue app //
/***********/

var explorer = new Vue({
    el: "#explorer-mri",
    data: {
        categories: cats,
        tabIndex: 0,
        quality_data: {},
        quality_data: false,
        cohort: "mcc",
        text_content: {},
        text_content_loaded: false,
    },
    computed: {
    },
    methods: {
        linkClass(idx) {
            if (this.tabIndex === idx) {
              return 'tabSelected'
            } else {
              return 'tabNotSelected'
            }
        },
        drawGraph() {

            var data = []
            var cohorts = ['mcc', 'ecc']
            var cohorts_text = ['MCC','ECC']
            var sessions = ['1', '3', '5']
            var waves = ['Wave 1', 'Wave 3', 'Wave 5']
            var trace, ses, cohort
            var colors = [lcid_colors[7], lcid_colors[2]]
            for (var c=0; c<2; c++) {
                cohort = cohorts[c]
                console.log(cohort)
                console.log(this.quality_data.ecc)
                console.log(this.quality_data.mcc)
                console.log(this.quality_data[cohort])
                var x_data = [], y_data = []
                for (var i=0; i<3; i++) {

                    y_array = this.quality_data[cohort][sessions[i]]['qoalat']
                    y_length = y_array.length
                    y_data = y_data.concat(y_array)
                    x_array = Array.apply(null, Array(y_array.length)).map(function () { return waves[i]})
                    x_data = x_data.concat(x_array)
                }
                trace = {
                    type: 'violin',
                    x: x_data,
                    y: y_data,
                    legendgroup: cohorts_text[c],
                    scalegroup: cohorts_text[c],
                    name: cohorts_text[c],
                    box: {
                        visible: true
                    },
                    line: {
                        color: colors[c],
                    },
                    meanline: {
                        visible: true
                    }
                }
                data.push(trace)
            }

            console.log(data)
            
            var layout = {
                title: {
                    text: "QoalaT score distributions per cohort and wave",
                    font: {
                        color: 'white',
                    }
                },
                xaxis: {
                    color: 'white'
                },
                yaxis: {
                    title: {
                        text: "QoalaT score",
                        font: {
                            color: 'white',
                        }
                    },
                    zeroline: false,
                    gridcolor: '#edddd43b',
                    color: 'white'
                },
                legend: {
                    font: {
                        color: 'white',
                    }
                },
                violinmode: 'group',
                plot_bgcolor: '#083655',
                paper_bgcolor: '#083655',
            }

            Plotly.newPlot('quality_plot', data, layout);

            // need to fix data

            // d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/violin_data.csv", function(err, rows){

            // function unpack(rows, key) {
            // return rows.map(function(row) { return row[key]; });
            // }

            // var data = [{
            // type: 'violin',
            // x: unpack(rows, 'day'),
            // y: unpack(rows, 'total_bill'),
            // legendgroup: 'M',
            // scalegroup: 'M',
            // name: 'M',
            // box: {
            // visible: true
            // },
            // line: {
            // color: 'blue',
            // },
            // meanline: {
            // visible: true
            // }
            // }, {
            // type: 'violin',
            // x: unpack(rows, 'day'),
            // y: unpack(rows, 'total_bill'),
            // legendgroup: 'F',
            // scalegroup: 'F',
            // name: 'F',
            // box: {
            // visible: true
            // },
            // line: {
            // color: 'pink',
            // },
            // meanline: {
            // visible: true
            // }
            // }]
            // console.log(data)

            // var layout = {
            // title: "Grouped Violin Plot",
            // yaxis: {
            // zeroline: false
            // },
            // violinmode: 'group'
            // }

            // Plotly.newPlot('quality_plot', data, layout);
            // });

            

            // // quality_plot
            // var trace1 = {
            //     x: this.quality_data['3']['score'],
            //     y: this.quality_data['3']['qoalat'],
            //     name: 'Wave 3',
            //     type: 'scatter',
            //     mode: 'markers'
            //   };
              
            // var trace2 = {
            //     x: this.quality_data['5']['score'],
            //     y: this.quality_data['5']['qoalat'],
            //     name: 'Wave 5',
            //     type: 'scatter',
            //     mode: 'markers'
            //   };
              
            // var data = [trace1, trace2];
              
            // var layout = {
            //     scattermode: 'group',
            //     xaxis: {title: 'QoalaT'},
            //     yaxis: {title: 'Score'},
            //     scattergap: 0.7
            // };
            
            // Plotly.newPlot('quality_plot', data, layout);

        }
    },

    beforeMount() {
               
        // Load text for headings/paragraphs
        text_content_file = 'assets/text_content.json'
        fetch(text_content_file)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(
                    "WARNING: text_content.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.text_content = responseJson;
            this.text_content_loaded = true;
            // Load qualoty data
            measure_data_file = 'inputs/processed_data/quality_data_structural.json'
            return fetch(measure_data_file)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(
                    "WARNING: quality_data_structural.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.quality_data = responseJson;
            this.quality_data_loaded = true;
        })
        .then(() => {
            this.drawGraph()
        })
        .catch((error) => {
            console.log(error);
        });
    },
});


// <script>
//     // Read data and headings from csv file
//     d3.csv("/data/fd_20subs_7t_aomovie.csv", function(err, rows){
//     // Function to unpack data
//     function unpack(rows, key) {
//       return rows.map(function(row) { return row[key]; });
//     }
//     // Get subject names
//     var headerNames = d3.keys(rows[0]);
//     // Initialise array to store traces for plotly graph
//     var data = [];
//     // Discretized colors for the individual traces
//     var colors = ['#ff9551','#f78f53','#ef8a56','#e78559','#e0805c','#d87b5f','#d07662','#c97165','#c16c68','#b9676b','#b2616e','#aa5c71','#a25774','#9b5277','#934d7a','#8b487d','#844380','#7c3e83','#743986','#6d3489'];
//     // For all subjects, get relevant data array and add as a trace to the plotly data
//     headerNames.forEach(function(heading, index) {
//       if (heading !== 'sub-10') {
//         trace = {
//           type: 'violin',
//           name: heading,
//           y: unpack(rows, heading).filter(function (el) {return el != null;}),
//           orientation: 'v',
//           side: 'positive',
//           width: 1.8,
//           points: false,
//           box: {
//             visible: true
//           },
//           boxpoints: false,
//           line: {
//             color: colors[index],
//             width: 2
//           },
//           meanline: {
//             visible: true
//           },
//           y0: heading
//         };
//         data.push(trace);
//       }
//     });
//     // Plotly graph layout specification
//     var layout = {
//       xaxis: {
//         showgrid: false,
//         zeroline: false,
//         tickangle: 45,
//       },
//       yaxis: {
//         title: "Framewise displacement (mm)",
//         range: [-0.15, 2],
//       },
//       margin: {
//         't': 15,
//       },
//       height: 500,
//     }
//     // Create plotly graph
//     Plotly.newPlot('fdAllSubs', data, layout);
//     });
//   </script>


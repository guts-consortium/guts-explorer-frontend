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
            var waves = ['Wave 1<br><i>MCC: 7-9y</i>', 'Wave 3<br><i>MCC: 9-11y</i>', 'Wave 5<br><i>MCC: 11-13y</i><br><i>ECC: 7-9y</i>']
            var trace, ses, cohort
            var colors = [lcid_colors[7], lcid_colors[2]]
            for (var c=0; c<2; c++) {
                cohort = cohorts[c]
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
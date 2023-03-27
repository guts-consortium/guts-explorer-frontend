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

            // quality_plot
            var trace1 = {
                x: this.quality_data['3']['score'],
                y: this.quality_data['3']['qoalat'],
                name: 'Wave 3',
                type: 'scatter',
                mode: 'markers'
              };
              
            var trace2 = {
                x: this.quality_data['5']['score'],
                y: this.quality_data['5']['qoalat'],
                name: 'Wave 5',
                type: 'scatter',
                mode: 'markers'
              };
              
            var data = [trace1, trace2];
              
            var layout = {
                scattermode: 'group',
                xaxis: {title: 'QoalaT'},
                yaxis: {title: 'Score'},
                scattergap: 0.7
            };
            
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



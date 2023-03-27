/***********/
// Vue app //
/***********/



// Start Vue instance
var explorer = new Vue({
    el: "#explorer-participants",
    data: {
        participant_data: {},
        measures_loaded: false,
        selected_cohort: 'ecc',
        cohort_options: [
            { value: 'ecc', text: 'Early Childhood Cohort (ECC)' },
            { value: 'mcc', text: 'Middle Childhood Cohort (MCC)' },
        ],
        text_content: {},
        text_content_loaded: false,
        summary_data: {},
        summary_data_loaded: false,
    },
    computed: {
    },
    methods: {
        drawGraph() {
            cohort = this.selected_cohort
            bar_thickness = 40
            pad_thickness = 15
            bar_color = "#D6BCB4"
            wave_text = ["1", "2", "3", "4", "5", "6"]
            wave_text_long = ["Wave 1", "Wave 2", "Wave 3", "Wave 4", "Wave 5", "Wave 6"]
            label_text = ["V1", "V2", "V3", "V4", "V5", "V6"]
            label_text_long = ["Visit 1", "Visit 2", "Visit 3", "Visit 4", "Visit 5", "Visit 6"]

            attendance = this.participant_data[cohort]['attendance']
            for(var i=0; i < attendance.length; i++) {
                for(var j=0; j < label_text_long.length; j++) {
                    if (attendance[i].indexOf(label_text_long[j] >= 0)) {
                        attendance[i] = attendance[i].replace(label_text_long[j],wave_text_long[j]);
                    }
                }
            }

            // Create inclusion and dropout labels
            value = this.participant_data[cohort]['value']
            vals = []
            const chunkSize = 4;
            for (let i = 0; i < value.length; i += chunkSize) {
                vals.push(value.slice(i, i + chunkSize));
            }
            N_total = vals[0].reduce((partialSum, a) => partialSum + a, 0);
            label = []
            label.push(vals[0][0] + vals[0][1])
            label.push(vals[0][2])
            for(var i=0; i < 5; i++) {
                label.push(vals[i][0] + vals[i][2])
                label.push(vals[i][1] + vals[i][3])
            }
            source = this.participant_data[cohort]['source']
            target = this.participant_data[cohort]['target']
            // Start and end values and percentages
            start_text = 'N=' + N_total.toString() + '<br>(100%)'
            N_end = label[label.length-2]
            perc_end = Math.round(N_end/N_total*100)
            end_text =  'N=' + N_end.toString() + '<br>(' + perc_end.toString() + '%)'
            link_color = this.participant_data[cohort]['link_color']
            opacity = 0.25
            yesno_colors = {
                "yes_color": "#197278",
                "no_color": "#DE752F",
            }
            link_color_hexalpha = [];
            for (var i=0; i<link_color.length; i++) {
                link_color_hexalpha.push(addAlphaToHex(yesno_colors[link_color[i]], opacity));
            }
            var data = {
                type: "sankey",
                orientation: "h",
                node: {
                    pad: pad_thickness,
                    thickness: bar_thickness,
                    line: {
                        color: "black",
                        width: 0.5
                    },
                    label: label,
                    customdata: attendance,
                    hovertemplate:'N=%{value:.0f} participants %{customdata}<extra></extra>',
                    color: bar_color
                },
                link: {
                  source: source,
                  target: target,
                  value: value,
                  color: link_color_hexalpha,
                  hovertemplate: 'Of the %{source.value} participants <br />that %{source.customdata},<br />' +
                    '%{value:.0f} %{target.customdata}<extra></extra>',
                }
            }
            var data = [data]

            annts = []
            y_below = -0.20
            annotation_text = ["Wave 1-6", "Attended", "Did not attend", start_text, end_text, "Legend:"]
            annotation_position = [[0.715, y_below], [0.825, y_below], [1, y_below], [-0.09, 0.5], [1.1, 0.5], [0.56, y_below]]
            annotation_color = [bar_color, yesno_colors['yes_color'], yesno_colors['no_color'], bar_color, bar_color, '#FFF0DF']
            annotation_font_color = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', 'black']
            annotation_opacity = [0.6, 0.4, 0.4, 0.6, 0.6, 1]
            for (var i=0; i<annotation_text.length; i++) {
                annts.push(
                    {
                        x: annotation_position[i][0],
                        y: annotation_position[i][1],
                        xref: "paper",
                        yref: "paper",
                        text: annotation_text[i],
                        showarrow: false,
                        font: {
                            family:"Courier New, monospace",
                            size:16,
                            color: 'black',//annotation_font_color[i],
                        },
                        align: "center",
                        bgcolor: annotation_color[i],
                        opacity: annotation_opacity[i],
                        bordercolor: annotation_color[i],
                        borderwidth: 2,
                        borderpad: 4,
                    }
                )
            }
            y_above = 1.15
            wave_text_position = [-0.01, 0.18, 0.40, 0.6, 0.82, 1.01]
            wave_text_ages = []
            for (var i=0; i<wave_text_long.length; i++) {
                wave_text_ages.push(
                    "Wave " + (i+1).toString() + "<br><i>"
                    + this.summary_data[cohort][(i+1).toString()]['age_from'] 
                    + '-'
                    + this.summary_data[cohort][(i+1).toString()]['age_to'] 
                    + 'y</i>'
                )
                annts.push(
                    {
                        x: wave_text_position[i],
                        y: y_above,
                        xref: "paper",
                        yref: "paper",
                        text: wave_text_ages[i],
                        showarrow: false,
                        align: "center",
                    }
                )
            }
            var layout = {
                margin: {l: 120, r: 120, b: 100, t:50},
                font: {
                    size: 16
                },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                annotations: annts,
            }
            const config = {
                displayModeBar: false, // hide toolbar
            };
            Plotly.react('sankey_diagram', data, layout, config)
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
            // Load summary data
            summary_file = 'inputs/processed_data/summary_data.json'
            return fetch(summary_file)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(
                    "WARNING: summary_data.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.summary_data = responseJson;
            this.summary_data_loaded = true;
            // Load new measure data
            participant_file = 'inputs/processed_data/participant_data.json'
            return fetch(participant_file)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(
                    "WARNING: participant_data.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.participant_data = responseJson;
            this.measures_loaded = true;
        })
        .then(() => {
            this.drawGraph()
        })
        .catch((error) => {
            console.log(error);
        });
    },
});
  
/***********/
// Vue app //
/***********/



// Start Vue instance
var explorer = new Vue({
    el: "#explorer-participation",
    data: {
        participation_data: {},
        measures_loaded: false,
        selected_cohort: 'ecc',
        cohort_options: [
            { value: 'ecc', text: 'Early Childhood Cohort (ECC)' },
            { value: 'mcc', text: 'Middle Childhood Cohort (MCC)' },
        ],
    },
    computed: {
    },
    methods: {
        drawGraph() {
            cohort = this.selected_cohort
            bar_thickness = 40
            pad_thickness = 15
            bar_color = "#D6BCB4"
            wave_text = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"]
            wave_text_long = ["Wave 1️⃣", "Wave 2️⃣", "Wave 3️⃣", "Wave 4️⃣", "Wave 5️⃣", "Wave 6️⃣"]
            label_text = ["V1", "V2", "V3", "V4", "V5", "V6"]
            label_text_long = ["Visit 1", "Visit 2", "Visit 3", "Visit 4", "Visit 5", "Visit 6"]
            label = this.participation_data[cohort]['label']
            for(var i=0; i < label.length; i++) {
                label[i] = wave_text[label_text.indexOf(label[i])]
            }
            attendance = this.participation_data[cohort]['attendance']
            for(var i=0; i < attendance.length; i++) {
                for(var j=0; j < label_text_long.length; j++) {
                    if (attendance[i].indexOf(label_text_long[j] >= 0)) {
                        attendance[i] = attendance[i].replace(label_text_long[j],wave_text_long[j]);
                    }
                }
            }
            source = this.participation_data[cohort]['source']
            target = this.participation_data[cohort]['target']
            value = this.participation_data[cohort]['value']
            link_color = this.participation_data[cohort]['link_color']
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
            y_below = -0.15
            annotation_text = ["Visit (1-6)", "Attended", "Did not attend", "N=238<br>(100%)", "N=177<br>(74.4%)"]
            annotation_position = [[0.2, y_below], [0.48, y_below], [0.8, y_below], [-0.09, 0.5], [1.1, 0.5]]
            annotation_color = [bar_color, yesno_colors['yes_color'], yesno_colors['no_color'], bar_color, bar_color]
            annotation_opacity = [0.9, 0.4, 0.4, 0.6, 0.6]
            // for (var i=0; i<annotation_text.length; i++) {
            //     annts.push(
            //         {
            //             x: annotation_position[i][0],
            //             y: annotation_position[i][1],
            //             xref: "paper",
            //             yref: "paper",
            //             text: annotation_text[i],
            //             showarrow: False,
            //             font: {
            //                 family:"Courier New, monospace",
            //                 size:16,
            //                 color:"#ffffff",
            //             },
            //             align: "center",
            //             bgcolor: annotation_color[i],
            //             opacity: annotation_opacity[i],
            //             bordercolor: annotation_color[i],
            //             borderwidth: 2,
            //             borderpad: 4,
            //         }
            //     )
            // }

            var layout = {
                margin: {l: 0, r: 0, b: 20, t:20},
                font: {
                    size: 16
                },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                annotations: [],
            }
            const config = {
                displayModeBar: false, // hide toolbar
            };
            Plotly.react('sankey_diagram', data, layout, config)
        }
    },
    beforeMount() {
        // Load new measure data
        participation_file = 'inputs/processed_data/participation_data.json'
        fetch(participation_file)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(
                    "WARNING: participation_data.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.participation_data = responseJson;
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
  
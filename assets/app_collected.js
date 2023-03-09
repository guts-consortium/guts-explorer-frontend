/***********/
// Vue app //
/***********/

// Start Vue instance
var explorer = new Vue({
    el: "#explorer-collected-alt",
    data: {
        categories: cats,
        measure_data: {},
        measure_pwpc_data: {},
        measures_loaded: false,
        measures_pwpc_loaded: false,
        cohort: "mcc",
        cohort_options: [
            { value: 'ecc', text: 'Early Childhood Cohort (ECC)' },
            { value: 'mcc', text: 'Middle Childhood Cohort (MCC)' },
        ],
        cohort_dict: {
            ecc: 'ECC',
            mcc: 'MCC',
        },
        cohort_dict_long: {
            'ecc': 'Early Childhood Cohort (ECC)',
            'mcc': 'Middle Childhood Cohort (MCC)',
        },
        respondent: "all",
        respondent_options: [
            {value: "all", text: "All respondents"},
            {value: "c", text: "Child"},
            {value: "op", text: "Other parent"},
            {value: "pp", text: "Primary parent"},
            {value: "ra", text: "Research assistant"},
        ],
        respondent_dict: {
            "all": "All respondents",
            "c": "Child",
            "op": "Other parent",
            "pp": "Primary parent",
            "ra": "Research assistant",
        },
        type_dict: {},
        type_options:[],
        type: "all",
        category_dict: {},
        category_options:[],
        category: "all",
        fields_to_display: [
            "short_name",
            "long_name",
            "measure_category",
            "measure_type",
            "respondents",
            "ecc",
            "mcc",
        ],
        display_details: {},
        all_categories: categories_list,
        categories_list: [],
        filter_categories: [],
        filter_types: [],
        search_text: "",
        display_details: {
            cohort: '-',
            session: '-',
            cohort_ses: '-',
            measure_category: '-',
            measure_name: '-',
            measure_type: '-',
            measure_shortname: '-',
            respondents: '-',
            description: '-',
            references: '-',
        },
        display_details_names: {
            cohort: 'Cohort',
            session: 'Session',
            cohort_ses: 'Cohort/session',
            measure_category: 'Measure Category',
            measure_name: 'Measure Name',
            measure_type: 'Measure Type',
            measure_shortname: 'Measure Shortname',
            respondents: 'Respondents',
            description: 'Description',
            references: 'References',
        },
        display_keys_basic: ['cohort', 'session', 'measure_category', 'measure_name', 'respondents'],
        citation_text: null,
        invalid_doi: false,
        citation_busy: false,
        showCopyCiteTooltip: false,

    },
    computed: {
        filtered_measures_cohort() {
            return this.measure_data.filter((item) => {
                return item.cohorts.indexOf(this.cohort) >= 0
            });
        },
        filtered_measures_respondent() {
            filter_measures = this.filtered_measures_cohort;
            return filter_measures.filter((item) => {
                if (this.respondent == "all") return true;
                return item.respondents.indexOf(this.respondent) >= 0
            });
        },
        filtered_measures_category() {
            filter_measures = this.filtered_measures_respondent;
            return filter_measures.filter((item) => {
                if (this.category == "all") return true;
                return item.measure_category == this.category
            });
        },
        filtered_measures_type() {
            filter_measures = this.filtered_measures_category;
            return filter_measures.filter((item) => {
                if (this.type == "all") return true;
                return item.measure_type == this.type
            });
        },
        filtered_measures() {
            return this.filtered_measures_type
        },
        filtered_measures_per_category() {
            filter_measures = this.filtered_measures;
            var output = {}
            for (var i=0; i<this.all_categories.length; i++) {
                cat = this.all_categories[i];
                output[cat] = filter_measures.filter((item) => {
                    return item.measure_category == cat
                })
                if (output[cat].length==0) {
                    delete output[cat];
                }
            }
            return output
        }

    },
    methods: {
        drawGraph2() {
            console.log(this.filtered_measures_per_category)
        },
        drawGraph() {
            this.clearDetails()
            var comp = this;
            var cohort_waves = this.cohort + '_waves';
            var N_measures = this.filtered_measures.length;
            var cat_measure_short_names = []
            var measure_short_names = this.filtered_measures.map(
                function(element) { return element.short_name }
            )
            var data = [];
            var available_cats = Object.keys(this.filtered_measures_per_category)
            var i = 0;
            for (var c=0; c<available_cats.length; c++) {
                cat = available_cats[c];
                console.log('---')
                console.log('cat: ' + cat)
                console.log('---')
                for (var cm=0; cm<this.filtered_measures_per_category[cat].length; cm++) {
                    cat_measure = this.filtered_measures_per_category[cat][cm];
                    console.log(cat_measure)
                    cat_measure_short_names.push(cat_measure['short_name'])
                    // now we get the actual data
                    cat_measure_cohort_waves = cat_measure[cohort_waves][this.respondent]
                    row = [0,0,0,0,0,0,0].map(function(element, idx) {
                        el = cat_measure_cohort_waves.indexOf((idx+1).toString()) >= 0 ? 1 : 0
                        return (N_measures-i)*el
                    })
                    // Set zero to null
                    row = row.map(function(val, i) {
                        val = parseInt(val, 10); 
                        return val === 0 ? null : val;
                    });
                    // Remove wave 7 if specified
                    if (!include_wave_7) {
                        row.pop()
                    }
                    // Add trace to data
                    trace = {
                        y: row,
                        mode: 'lines+markers',
                        type: 'scatter',
                        line: {
                            width: 3,
                            color: lcid_colors[this.categories_list.indexOf(cat)+1],
                        },
                        marker: {
                            size: 14,
                            color: addAlphaToHex(lcid_colors[this.categories_list.indexOf(cat)+1],0.5),
                            line: {
                                width: 2,
                                color: lcid_colors[this.categories_list.indexOf(cat)+1],
                            }
                            // symbol: 'square'
                        },
                        connectgaps: true,
                        showlegend: false,
                        hovertemplate: '<b>%{x}<br>%{y}</b>' +
                                        '<extra></extra>'
                    }
                    data.push(trace);
                    i++;
                }
            }
            console.log(data)

            // Variables influenced by inclusion/exclusion of covid wave (7)
            wave_text = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "🦠"]
            wave_vals = [0,1,2,3,4,5,6]
            if (!include_wave_7) {
                wave_text.pop()
                wave_vals.pop()
            }
            range_max = wave_text.length + 0.5

            min_height = 150
            calc_height = 30*N_measures < min_height ? min_height : 30*N_measures

        
            var layout = {
                margin: {l: 120, r: 0, b: 0, t:40},
                hovermode: 'closest',
                width: 600,
                height: calc_height,
                xaxis: {
                    showgrid: true,
                    gridwidth: 1,
                    gridcolor: '#EDDDD4',
                    zeroline: false,
                    range: [-0.5, range_max],
                    showline: false,
                    side: 'top',
                    showticklabels: true,
                    tickvals:wave_vals,
                    ticktext:wave_text,
                    tickfont:{size:20},
                    color: '#FFFFFF',
                    fixedrange: true,
                    // tickangle: -45,
                },
                yaxis: {
                    showgrid: false,
                    zeroline: false,
                    showline: false,
                    tickvals: Array.from({length: N_measures}, (_, j) => j + 1),
                    ticktext: cat_measure_short_names.reverse(),
                    range: [0, N_measures+1],
                    color: '#FFFFFF',
                    fixedrange: true,
                },
                plot_bgcolor: '#083655',
                paper_bgcolor: '#083655',
                hovermode: 'closest',
            };
            const config = {
                displayModeBar: false, // hide toolbar
            };
            Plotly.newPlot('measure_graph', data, layout, config);
            var myPlot = document.getElementById('measure_graph')
            myPlot.on('plotly_click',
                function(data){
                    console.log(data)
                    x = data.points[0].x // 0,1,2,3,4,5,(6)
                    y = data.points[0].y // 1,2,3,...,n
                    console.log(cat_measure_short_names[y-1])
                    newDeets = {}
                    newDeets.cohort = comp.cohort_dict_long[comp.cohort]
                    var measure = comp.measure_data.filter(function(element) {
                        return element.short_name == cat_measure_short_names[y-1]
                    });
                    measure = measure[0]
                    console.log(measure)
                    newDeets.measure_category = comp.category_dict[measure.measure_category]
                    newDeets.session = wave_text[x]
                    newDeets.measure_shortname = measure.short_name
                    newDeets.measure_type = comp.type_dict[measure.measure_type]
                    newDeets.description = measure.description ? measure.description : '-'
                    newDeets.measure_name = measure.long_name
                    newDeets.respondents = measure.respondent
                    newDeets.respondents = newDeets.respondents.replace('pp', 'Primary parent')
                    newDeets.respondents = newDeets.respondents.replace('op', 'Other parent')
                    newDeets.respondents = newDeets.respondents.replace('c', 'Child')
                    newDeets.respondents = newDeets.respondents.replace('-', ', ')
                    newDeets.references = measure.reference ? measure.reference : ''
                    newDeets.cohort_ses = comp.cohort_dict[comp.cohort] + ', Wave ' + wave_text[x]
                    newDeets.doi = measure.doi
                    comp.updateDetails(newDeets)
                }
            )
            // Change cursor to pointer when hovering over a data point
            dragLayer = document.getElementsByClassName('nsewdrag')[0]
            myPlot.on('plotly_hover', function(data){
                dragLayer.style.cursor = 'pointer'
            });
            myPlot.on('plotly_unhover', function(data){
                dragLayer.style.cursor = ''
            });
        },
        updateDetails(newDeets) {
            // console.log('insideupdate')
            // console.log(newDeets)
            Object.keys(newDeets).forEach(k => {
                this.display_details[k] = newDeets[k]
            })
            // console.log(this.display_details)
        },
        clearDetails() {
            newDeets = {}
            newDeets.cohort_ses = '-'
            newDeets.measure_category = '-'
            newDeets.measure_type = '-'
            newDeets.session = '-'
            newDeets.measure_shortname = '-'
            newDeets.description = '-'
            newDeets.measure_name = '-'
            newDeets.respondents = '-'
            newDeets.references = '-'
            newDeets.doi = null
            this.updateDetails(newDeets)
        },        
        getCitationText(doi = "") {

            this.citation_text = null
            this.$refs['cite-modal'].show()
            if (doi && doi.includes("https://doi.org/")) {
                this.invalid_doi = false;
                this.citation_busy = true;
                const headers = {
                    Accept: "text/x-bibliography; style=apa",
                };
                fetch(doi, { headers })
                    .then((response) => response.text())
                    .then((data) => {
                    this.citation_text = data;
                    console.log(data);
                    this.citation_busy = false;
                    });
            } else {
                this.invalid_doi = true;
            }
        },
        copyCitationText(index) {
            // https://stackoverflow.com/questions/60581285/execcommand-is-now-obsolete-whats-the-alternative
            // https://www.sitepoint.com/clipboard-api/
            selectText = document.getElementById("citation").textContent;
            navigator.clipboard
              .writeText(selectText)
              .then(() => {})
              .catch((error) => {
                alert(`Copy failed! ${error}`);
              });
            this.showCopyCiteTooltip = true;
        },
        hideCiteTooltipLater() {
            setTimeout(() => {
                this.showCopyCiteTooltip = false;
            }, 1000);
        },
    },
    beforeMount() {
        // Load new measure data
        measure_data_file = 'inputs/processed_data/measure_data.json'
        fetch(measure_data_file)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(
                    "WARNING: measure_data.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.measure_data = responseJson;
            // categories
            all_cats = this.measure_data.map(function(measure) {
                return measure["measure_category"];
            });
            this.categories_list = [...new Set(categories_list)].sort()
            this.category_options = this.categories_list.map((item, idx) => (
                {'value': item, 'text': makeReadable(item)}
            ))
            this.category_options.unshift({value: 'all', text: 'All categories'})
            this.category_dict = this.categories_list.reduce((output, curr) => {
                output[curr] = makeReadable(curr)
                return output;
              }, {});
            this.category_dict['all'] = 'All categories'
            // types
            all_types = this.measure_data.map(function(measure) {
                return measure["measure_type"];
            });
            this.types_list = [...new Set(all_types)].sort()
            this.type_options = this.types_list.map((item, idx) => (
                {'value': item, 'text': makeReadable(item)}
            ))
            this.type_options.unshift({value: 'all', text: 'All types'})
            this.type_dict = this.types_list.reduce((output, curr) => {
                output[curr] = makeReadable(curr)
                return output;
              }, {});
            
            this.type_dict['all'] = 'All types'
            this.measures_loaded = true;
        })
        .then(() => {
            this.drawGraph()
        })
        .catch((error) => {
            console.log(error);
        });

        // // Load measure per wave/cohort data
        // measure_pwpc_data_file = 'inputs/processed_data/measure_per_wave_per_cohort.json'
        // fetch(measure_pwpc_data_file)
        // .then((response) => {
        //     if (response.ok) {
        //         return response.json();
        //     } else {
        //         console.log(
        //             "WARNING: measure_per_wave_per_cohort.json file could not be loaded"
        //         );
        //     }
        // })
        // .then((responseJson) => {
        //     this.measure_pwpc_data = responseJson;
        //     this.measures_pwpc_loaded = true;
        //     console.log(this.measure_pwpc_data)
        // })
        // .then(() => {
        //     this.drawGraph()
        // })
        // .catch((error) => {
        //     console.log(error);
        // });
        
    },
});
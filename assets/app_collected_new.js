/***********/
// Vue app //
/***********/
var all_respondents = [
    "child",
    "other parent",
    "primary parent",
]
var all_respondents_short = {
    "child": "c",
    "other parent": "op",
    "primary parent": "pp",
}
var respondent_text = {
    "c": "Child",
    "op": "Other parent",
    "pp": "Primary parent",
    "pp-op": "Primary parent\nOther Parent",
    "pp-c": "Primary parent\nChild",
    "ra": "Research assistant",
}
var all_cohorts = [
    "ECC",
    "MCC",
]
var all_sessions = [
    "Wave 1",
    "Wave 2",
    "Wave 3",
    "Wave 4",
    "Wave 5",
    "Wave 6",
    "Wave C",
]
var all_sessions_nr = {
    "Wave 1": "1",
    "Wave 2": "2",
    "Wave 3": "3",
    "Wave 4": "4",
    "Wave 5": "5",
    "Wave 6": "6",
    "Wave C": "7",
}
var all_sessions_short = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "C",
]
// Start Vue instance
var explorer = new Vue({
    el: "#explorer-collected",
    data: {
        categories: cats,
        measure_data: {},
        measures_loaded: false,
        filter_toggles: {
            "category": true,
            "session": true,
            "type": true,
        },
        filter_arrays: {
            "category": categories_list,
            "session": all_sessions,
            "type": [],
            "respondent": all_respondents,
            "cohort": all_cohorts,
        },        
        all_arrays: {
            "category": categories_list,
            "session": all_sessions,
            "type": [],
            "respondent": all_respondents,
            "cohort": all_cohorts,
        },
        all_types: [],
        filter_types: [],
        all_respondents: all_respondents,
        filter_respondents: all_respondents,
        all_cohorts: all_cohorts,
        filter_cohorts: all_cohorts,
        all_sessions: all_sessions,
        filter_sessions: all_sessions,
        search_text: "",
        search_tags: [],
        cohort_options: [
            { value: 'ecc', text: 'ECC' },
            { value: 'mcc', text: 'MCC' },
        ],
        all_sessions_short: all_sessions_short,

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
        text_content: {},
        text_content_loaded: false,

    },
    computed: {
        all_short_names: function () {
            name_list = this.measure_data.map(function(measure) {
                return measure["short_name"];
            });
            return [...new Set(name_list)]
        },
        all_long_names: function () {
            name_list = this.measure_data.map(function(measure) {
                return measure["long_name"];
            });
            return [...new Set(name_list)]
        },
        
        filtered_measures_search() {
            regex = new RegExp(this.search_text.toLowerCase())
            return this.measure_data.filter((c) => {
              if (this.search_text == "") return true;
              return (
                c.short_name.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0 ||
                c.long_name.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0 ||
                c.measure_category.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0 ||
                c.measure_type.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0 ||
                c.description.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0 ||
                c.keywords ? c.keywords.some(kw => kw.includes(this.search_text.toLowerCase())) : null
              );
            });
        },
        filtered_measures_tags() {
            filter_measures = this.filtered_measures_search;
            return filter_measures.filter((c) => {
                if (this.search_tags.length == 0) return true;
                return this.search_tags.every((v) =>
                    c.short_name.toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c.long_name.toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c.measure_category.toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c.measure_type.toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c.description.toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c.keywords ? c.keywords.includes(v.toLowerCase()): null
                );
            });
        },
        filtered_measures_category() {
            filter_measures = this.filtered_measures_tags;
            return filter_measures.filter((c) => {
                if (this.filter_arrays["category"].length == this.all_arrays["category"].length) return true;
                return this.filter_arrays["category"].indexOf(c.measure_category ) >= 0
            });
        },
        filtered_measures_type() {
            filter_measures = this.filtered_measures_category;
            return filter_measures.filter((c) => {
                if (this.filter_arrays["type"].length == this.all_arrays["type"].length) return true;
                return this.filter_arrays["type"].indexOf(c.measure_type ) >= 0
            });
        },
        filtered_measures_cohort() {
            filter_measures = this.filtered_measures_type;
            return filter_measures.filter((c) => {
                if (this.filter_arrays["cohort"].length == this.all_arrays["cohort"].length) return true;
                return this.filter_arrays["cohort"].some(r=>c["cohorts"].includes(r.toLowerCase()))
            });
        },
        filtered_measures_respondent() {
            filter_measures = this.filtered_measures_cohort;
            return filter_measures.filter((c) => {
                if (this.filter_arrays["respondent"].length == this.all_arrays["respondent"].length) return true;
                return this.filter_arrays["respondent"].some(r=>c["respondents"].includes(all_respondents_short[r]))
            });
        },
        filtered_measures_session() {
            filter_measures = this.filtered_measures_respondent;
            return filter_measures.filter((c) => {
                if (this.filter_arrays["session"].length == this.all_arrays["session"].length) return true;
                return (this.filter_arrays["session"].some(r=>c["ecc"].includes(all_sessions_nr[r])) ||
                this.filter_arrays["session"].some(r=>c["mcc"].includes(all_sessions_nr[r])))
            });
        },
        category_check_icon() {
            if (this.filter_toggles["category"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },
        type_check_icon() {
            if (this.filter_toggles["type"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },
        session_check_icon() {
            if (this.filter_toggles["session"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },
        filtered_measures() {
            return this.filtered_measures_session
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
                // ln = []
                for (var cm=0; cm<this.filtered_measures_per_category[cat].length; cm++) {
                    cat_measure = this.filtered_measures_per_category[cat][cm];
                    console.log(cat_measure)
                    cat_measure_short_names.push(cat_measure['short_name'])
                    // ln.push(cat_measure['long_name'])
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
                    ln = cat_measure['long_name']
                    longnames = [ln, ln, ln, ln, ln, ln, ln]
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
                        customdata: longnames,
                        hovertemplate: '<b>%{x}<br>%{customdata}</b>' +
                                        '<extra></extra>'
                    }
                    data.push(trace);
                    i++;
                }
            }
            console.log(data)

            // Variables influenced by inclusion/exclusion of covid wave (7)
            wave_text = ["Wave 1", "Wave 2", "Wave 3", "Wave 4", "Wave 5", "Wave 6", "Wave C"]
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
            // Load new measure data
            measure_data_file = 'inputs/processed_data/measure_data.json'
            return fetch(measure_data_file)
        })
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
    },
})
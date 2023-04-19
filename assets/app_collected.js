/***********/
// Vue app //
/***********/

var all_respondents = [
    "child",
    "other parent",
    "primary parent",
    "research assistant",
]
var all_respondents_short = {
    "child": "c",
    "other parent": "op",
    "primary parent": "pp",
    "research assistant": "ra",
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
        filter_toggles: {
            "cohort": true,
            "respondent": true,
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
        // all_categories: categories_list,
        // filter_categories: categories_list,
        all_types: [],
        filter_types: [],
        all_respondents: all_respondents,
        filter_respondents: all_respondents,
        all_cohorts: all_cohorts,
        filter_cohorts: all_cohorts,
        all_sessions: all_sessions,
        filter_sessions: all_sessions,
        search_text: "",
        search_text_tags: [],
        all_sessions_short: all_sessions_short,
        text_content: {},
        text_content_loaded: false,
        search_keywords: [],
        keyword_text: "",
        keyword_dropdown_open: false,
        keyword_options: [],
        keyword_options_filtered: [],
        keyword_options_available: [],
        keywords_ready: false,
        popoverShow: false,

        categories: cats,
        measure_data: [],
        measures_loaded: false,
        cohort: "all",
        cohort_options: [
            { value: "all", text: "All cohorts"},
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
        text_content: {},
        text_content_loaded: false,

    },
    computed: {
        included_measures_tags() {
            filter_measures = this.measure_data;
            return filter_measures.filter((c) => {
                if (this.search_text_tags.length == 0) return true;
                return this.search_text_tags.some((v) =>
                    c.short_name.toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c.long_name.toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c.description.toLowerCase().indexOf(v.toLowerCase()) >= 0
                );
            });
        },
        included_measures_keywords() {
            filter_measures = this.measure_data;
            return filter_measures.filter((c) => {
              if (this.search_keywords.length == 0) return true;
              return this.search_keywords.some((v) => c.keywords ? c.keywords.includes(v): null);
            });
          },
        included_measures() {
            if (this.search_text_tags.length == 0 && this.search_keywords.length == 0) {
                return this.measure_data
            }
            else if (this.search_text_tags.length > 0 && this.search_keywords.length == 0) {
                return this.included_measures_tags
            }
            else if (this.search_text_tags.length == 0 && this.search_keywords.length > 0) {
                return this.included_measures_keywords
            }
            else {
                var ids = new Set(this.included_measures_tags.map(d => d.short_name));
                return [...this.included_measures_tags, ...this.included_measures_keywords.filter(d => !ids.has(d.short_name))];
            }
        },
        filtered_measures_respondent() {
            filter_measures = this.included_measures;
            return filter_measures.filter((c) => {
                if (this.filter_arrays["respondent"].length == this.all_arrays["respondent"].length) return true;
                return this.filter_arrays["respondent"].some(r=>c["respondents"].includes(all_respondents_short[r]))
            });
        },
        filtered_measures_category() {
            filter_measures = this.filtered_measures_respondent;
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
        },
        filt_count() {
            return this.filtered_measures.length
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
        respondent_check_icon() {
            if (this.filter_toggles["respondent"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },
        cohort_check_icon() {
            if (this.filter_toggles["cohort"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },

    },
    watch: {
        filtered_measures_per_category(newState) {
            this.drawGraph()
        }
    },
    methods: {
        drawGraph2() {
            console.log(this.filtered_measures_per_category)
        },
        drawGraph() {
            this.clearDetails()
            var comp = this;
            var cohorts_list = Object.keys(this.cohort_dict)
            var N_measures = this.filtered_measures.length;
            var cat_measure_short_names = []
            var data = [];
            // after measures have been filtered (this.filtered_measures_per_category),
            // which categories are still included?
            var available_cats = Object.keys(this.filtered_measures_per_category)
            var i = 0;
            // Now loop through the categories that are still included in the filtered measures
            for (var c=0; c<available_cats.length; c++) {
                cat = available_cats[c];
                console.log('---')
                console.log('cat: ' + cat)
                console.log('---')
                // for a given category, loop through all its measures
                for (var cm=0; cm<this.filtered_measures_per_category[cat].length; cm++) {
                    cat_measure = this.filtered_measures_per_category[cat][cm];
                    ln = cat_measure['long_name']
                    longnames = [ln, ln, ln, ln, ln, ln, ln]
                    console.log(cat_measure)
                    // Get the value for the y-axis => short name
                    cat_measure_short_names.push(cat_measure['short_name'])
                    // now we get the actual data, for both cohorts
                    var cat_measure_cohort_waves = {}
                    var row = {}
                    var trace = {}
                    for (var ch=0; ch<cohorts_list.length; ch++) {
                        coh = cohorts_list[ch]
                        cohort_waves = coh + '_waves';
                        cat_measure_cohort_waves[coh] = cat_measure[cohort_waves][this.respondent]
                        row[coh] = [0,0,0,0,0,0,0].map(function(element, idx) {
                            el = cat_measure_cohort_waves[coh].indexOf((idx+1).toString()) >= 0 ? 1 : 0
                            return (N_measures-i)*el
                        })
                        // put MCC covid wave in the correct position: 1,2,3,4,5,7,6
                        if (coh == 'mcc') {
                            row[coh] = row[coh].slice(0,5).concat([row[coh][6], row[coh][5]])
                        }
                        // console.log(row)
                        // Set zero to null
                        row[coh] = row[coh].map(function(val, x) {
                            val = parseInt(val, 10); 
                            return val === 0 ? null : val;
                        });
                        // Add trace to cohort data
                        trace[coh] = {
                            y: row[coh],
                            mode: 'lines+markers',
                            type: 'scatter',
                            line: {
                                width: 3,
                                color: lcid_colors[categories_list.indexOf(cat)+1],
                            },
                            marker: {
                                size: 14,
                                color: addAlphaToHex(lcid_colors[categories_list.indexOf(cat)+1],0.5),
                                line: {
                                    width: 2,
                                    color: lcid_colors[categories_list.indexOf(cat)+1],
                                }
                                // symbol: 'square'
                            },
                            connectgaps: true,
                            showlegend: false,
                            customdata: longnames,
                            hovertemplate: '<b>%{x}<br>%{customdata}</b>' +
                                            '<extra></extra>'
                        }
                        if (ch==1) {
                            trace[coh]['xaxis'] = 'x2';
                        }
                        data.push(trace[coh]);
                    }
                    i++;
                }
            }
            console.log(data)

            // Variables influenced by inclusion/exclusion of covid wave (7)
            wave_text = {
                ecc: ["Wave 1", "Wave 2", "Wave 3", "Wave 4", "Wave 5", "Wave 6", "Wave C"],
                mcc: ["Wave 1", "Wave 2", "Wave 3", "Wave 4", "Wave 5", "Wave C", "Wave 6"]
            }
            wave_text_html = {
                ecc: ["<b>Wave 1</b><br>&nbsp;&nbsp;3-5y", "<b>Wave 2</b><br>&nbsp;&nbsp;4-6y", "<b>Wave 3</b><br>&nbsp;&nbsp;5-7y", "<b>Wave 4</b><br>&nbsp;&nbsp;6-8y", "<b>Wave 5</b><br>&nbsp;&nbsp;7-9y", "<b>Wave 6</b><br>&nbsp;&nbsp;8-10y", "<b>Wave C</b><br>&nbsp;&nbsp;8-10y"],
                mcc: ["<b>Wave 1</b><br>&nbsp;&nbsp;7-9y", "<b>Wave 2</b><br>&nbsp;&nbsp;8-10y", "<b>Wave 3</b><br>&nbsp;&nbsp;9-11y", "<b>Wave 4</b><br>&nbsp;10-12y", "<b>Wave 5</b><br>&nbsp;11-13y", "<b>Wave C</b><br>&nbsp;11-13y", "<b>Wave 6</b><br>&nbsp;12-14y"]
            }
            wave_vals = {
                ecc: [0,1,2,3,4,5,6],
                mcc: [0,1,2,3,4,5,6]
            }
            range_max = 7.5
            min_height = 280
            calc_height = 30*N_measures < min_height ? min_height : 30*N_measures
            var layout = {}

            layout = {
                margin: {l: 120, r: 0, b: 0, t:90},
                hovermode: 'closest',
                width: 800, // var
                height: calc_height,
                xaxis: {
                    automargin: true,
                    showgrid: true,
                    gridwidth: 1,
                    gridcolor: '#EDDDD4',
                    zeroline: false,
                    range: [-0.5, range_max],
                    showline: false,
                    side: 'top',
                    showticklabels: true,
                    tickvals:wave_vals['ecc'],
                    ticktext:wave_text_html['ecc'],
                    tickfont:{size:12},
                    color: '#FFFFFF',
                    fixedrange: true,
                    tickangle: -50,
                    title: {
                        text: 'Early Childhood Cohort',
                        standoff: 30,
                        font: {
                          size: 18,
                        }
                    },
                },
                xaxis2: {
                    automargin: true,
                    showgrid: true,
                    gridwidth: 1,
                    gridcolor: '#EDDDD4',
                    zeroline: false,
                    range: [-0.5, range_max],
                    showline: false,
                    side: 'top',
                    showticklabels: true,
                    tickvals:wave_vals['mcc'],
                    ticktext:wave_text_html['mcc'],
                    tickfont:{size:12},
                    color: '#FFFFFF',
                    fixedrange: true,
                    tickangle: -50,
                    title: {
                        text: 'Middle Childhood Cohort',
                        standoff: 30,
                        font: {
                        //   family: 'Courier New, monospace',
                          size: 18,
                        //   color: '#7f7f7f'
                        }
                    },
                    // domain: {
                    //     x: [0.4, 1]
                    // }
                },
                yaxis: {
                    showgrid: true,
                    zeroline: false,
                    showline: false,
                    tickvals: Array.from({length: N_measures}, (_, j) => j + 1),
                    ticktext: cat_measure_short_names.reverse(),
                    range: [0, N_measures+1],
                    color: '#FFFFFF',
                    fixedrange: true,
                },
                grid: {
                    rows: 1,
                    columns: 2,
                    pattern: 'coupled',
                },
                plot_bgcolor: '#083655',
                paper_bgcolor: '#083655',
                hovermode: 'closest',
            }
            
            const config = {
                displayModeBar: false, // hide toolbar
            };
            Plotly.newPlot('measure_graph', data, layout, config);
            var myPlot = document.getElementById('measure_graph')
            myPlot.on('plotly_click',
                function(data){
                    console.log(data)
                    x = data.points[0].x // 0,1,2,3,4,5,6
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
                    
                    newDeets.measure_shortname = measure.short_name
                    newDeets.measure_type = comp.type_dict[measure.measure_type]
                    newDeets.description = measure.description ? measure.description : '-'
                    newDeets.measure_name = measure.long_name
                    newDeets.respondents = measure.respondent
                    newDeets.respondents = newDeets.respondents.replace('pp', 'Primary parent')
                    newDeets.respondents = newDeets.respondents.replace('op', 'Other parent')
                    newDeets.respondents = newDeets.respondents.replace('c', 'Child')
                    newDeets.respondents = newDeets.respondents.replace('ra', 'Research assistant')
                    newDeets.respondents = newDeets.respondents.replace('-', ', ')
                    newDeets.references = measure.reference ? measure.reference : ''
                    chrt = data.points[0].xaxis._name == 'xaxis2' ? 'mcc' : 'ecc'
                    newDeets.session = wave_text[chrt][x]
                    newDeets.cohort_ses = chrt.toUpperCase() + ', ' + newDeets.session
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
            Object.keys(newDeets).forEach(k => {
                this.display_details[k] = newDeets[k]
            })
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
        resetTable() {
            Object.keys(this.filter_toggles).forEach(key => {
                this.filter_toggles[key] = true
                this.filter_arrays[key] = this.all_arrays[key]
            })
            this.search_keywords = []
            this.search_text_tags = []
            this.search_text = ""
            this.keyword_text = ""
            this.keyword_options = all_keywords;
            this.keyword_options_filtered = this.keyword_options;
            this.keyword_options_available = this.keyword_options;
            this.keywords_ready = true;

        },
        addSearchTextTag(option) {
            if (this.search_text_tags.indexOf(this.search_text) < 0) {
                this.search_text_tags.push(this.search_text);
            }
            this.search_text = "";
        },
        removeSearchTextTag(tag) {
            idx = this.search_text_tags.indexOf(tag);
            if (idx > -1) {
                this.search_text_tags.splice(idx, 1);
            }
        },
        addSearchKeyword(option) {
            this.search_keywords.push(option);
            this.clearSearchKeywordText();
            this.filterKeywords();
        },
        removeSearchKeyword(kw) {
            idx = this.search_keywords.indexOf(kw);
            if (idx > -1) {
                this.search_keywords.splice(idx, 1);
            }
            this.filterKeywords();
        },
        clearSearchKeywordText() {
            this.keyword_text = "";
            this.filterKeywords();
            this.popoverShow = false;
        },
        filterKeywords() {
            this.keyword_options_available = this.keyword_options.filter(
                (x) => this.search_keywords.indexOf(x) === -1
            );
            this.keyword_options_filtered = this.keyword_options_available.filter(
                (str) => str.toLowerCase().indexOf(this.keyword_text.toLowerCase()) >= 0
            );
        },
        inputKeywordText() {
            this.popoverShow = true;
            this.filterKeywords();
        },
        onClose() {
            this.popoverShow = false;
        },
        validator(kw) {
            return this.keyword_options_available.indexOf(kw) >= 0;
        },
        exportTable(format) {
            downloadArrayAsFormat(this.filtered_measures, format, "lcid_metadata")
        },
        toggleChecks(name) {
            this.filter_toggles[name] = !this.filter_toggles[name]

            console.log(name)
            console.log(this.filter_toggles[name])
            console.log(this.filter_arrays)
            if (this.filter_toggles[name]) {
                this.filter_arrays[name] = this.all_arrays[name]
            }
            else {
                this.filter_arrays[name] = []
            }
        },
        getRespondentText(resp) {
            return respondent_text[resp]
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

            // all_keywords = this.measure_data.map(function(measure) {
            //     return measure["keywords"];
            // });
            // all_keywords = [...new Set(all_keywords.flat())]
            // all_keywords.splice(all_keywords.indexOf(''), 1);
            // all_keywords = all_keywords.sort()
            // console.log("all keywords bish!")
            // console.log(all_keywords)
            // console.log(all_keywords.length)

            // this.measure_data = responseJson;
            types_list = this.measure_data.map(function(measure) {
                return measure["measure_type"];
            });
            this.all_arrays["type"] = [...new Set(types_list)]
            this.all_arrays["type"] = this.all_arrays["type"].sort()
            this.filter_arrays["type"] = this.all_arrays["type"]

            all_keywords = this.measure_data.map(function(measure) {
                return measure["keywords"];
            });
            all_keywords = [...new Set(all_keywords.flat())]
            all_keywords.splice(all_keywords.indexOf(''), 1);
            all_keywords = all_keywords.sort()
            this.keyword_options = all_keywords;
            this.keyword_options_filtered = this.keyword_options;
            this.keyword_options_available = this.keyword_options;
            this.keywords_ready = true;
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
/***********/
// Vue app //
/***********/



// Start Vue instance
var explorer = new Vue({
    el: "#guts",
    data: {
        selected_component: "home", // must be one of: home, table, checkboxes, basket
        measure_data: [],
        measure_headings: [],
        measure_data_loaded: false,
        measure_shortnames: [],
        participant_data: [],
        participant_measures: [],
        participant_measures_loaded: false,
        search_text: "",
        search_text_tags: [],
        filter_toggles: {
            "cohort": true,
            "data-category": true,
            "session": true,
            "data-type": true,
            "age": true,
        },
        // Note: the keys and initial values of the all_arrays and filter_arrays objects
        // below have to be declared here (as opposed to just `all_arrays: {}`) because
        // otherwise these arrays won't be reactive. This changes in Vue 3.
        all_arrays: {
            "cohort": [],
            "data-category": [],
            "session": [],
            "data-type": [],
            "age": [],
        },
        filter_arrays: {
            "cohort": [],
            "data-category": [],
            "session": [],
            "data-type": [],
            "age": [],
        },
        filter_age_min: null,
        filter_age_max: null,
        age_min: null,
        age_max: null,
        all_options_loaded: false,
        basket_arrays: {
            "cohort": [],
            "data-category": [],
            "session": [],
            "data-type": [],
            "age": [],
            "short-code": [],
        },
        basket: [],
        basket_length: 0,
        text_keys: {
            "cohort": "Cohort",
            "data-category": "Data category",
            "session": "Session",
            "data-type": "Data type",
            "age": "Age",
            "short-name": "Short name"
        },
        text_keys_multiple: {
            "cohort": "Cohorts",
            "data-category": "Data categories",
            "session": "Sessions",
            "data-type": "Data types",
            "age": "Ages",
            "short-name": "Short names"
        },
    },
    computed: {
        included_measures_tags() {
            var filter_measures = this.measure_data;
            return filter_measures.filter((c) => {
                if (this.search_text_tags.length == 0) return true;
                return this.search_text_tags.some((v) =>
                    c["short-name"].toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c["long-name"].toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c["description"].toLowerCase().indexOf(v.toLowerCase()) >= 0
                );
            });
        },
        included_measures() {
            return this.included_measures_tags
        },
        // other
        category_check_icon() {
            if (this.filter_toggles["data-category"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },
        type_check_icon() {
            if (this.filter_toggles["data-type"]) {
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
        cohort_check_icon() {
            if (this.filter_toggles["cohort"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },
        age_check_icon() {
            if (this.filter_toggles["age"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },
        included_samples() {
            return this.participant_measures
        },
        filtered_samples_cohort() {
            filter_samples = this.included_samples;
            return filter_samples.filter((sample) => {
                if (this.filter_arrays["cohort"].length == this.all_arrays["cohort"].length) return true;
                return this.filter_arrays["cohort"].indexOf(sample["cohort"] ) >= 0
            });
        },
        filtered_samples_session() {
            filter_samples = this.filtered_samples_cohort;
            return filter_samples.filter((sample) => {
                if (this.filter_arrays["session"].length == this.all_arrays["session"].length) return true;
                return this.filter_arrays["session"].indexOf(sample["session"] ) >= 0
            });
        },
        filtered_samples_category() {
            filter_samples = this.filtered_samples_session;
            return filter_samples.filter((sample) => {
                if (this.filter_arrays["data-category"].length == this.all_arrays["data-category"].length) return true;
                return this.filter_arrays["data-category"].indexOf(sample["data-category"] ) >= 0
            });
        },
        filtered_samples_type() {
            filter_samples = this.filtered_samples_category;
            return filter_samples.filter((sample) => {
                if (this.filter_arrays["data-type"].length == this.all_arrays["data-type"].length) return true;
                return this.filter_arrays["data-type"].indexOf(sample["data-type"] ) >= 0
            });
        },
        filtered_samples_age() {
            filter_samples = this.filtered_samples_type;
            return filter_samples.filter((sample) => {
                if (this.filter_arrays["age"].length == this.all_arrays["age"].length) return true;
                return this.filter_arrays["age"].indexOf(sample["age"] ) >= 0
            });
        },
        filtered_samples_count() {
            return this.filtered_samples_age.length
        },
        filtered_participants_count() {
            var filtered_participants = this.filtered_samples_age.map((m) => (m["ppn"]));
            var filtered_participants_list = [...new Set(filtered_participants)]
            return filtered_participants_list.length
        },
        // basket_empty() {
        //     var b = false
        //     for (var key in this.basket_arrays) {
        //         b = b || this.basket_arrays[key].length > 0
        //     }
        //     return !b
        // },
        // basket_samples_cohort() {
        //     console.log("computing basket samples cohort")
        //     filter_samples = this.included_samples;
        //     return filter_samples.filter((sample) => {
        //         if (this.filter_arrays["cohort"].length == this.all_arrays["cohort"].length) return true;
        //         return this.filter_arrays["cohort"].indexOf(sample["cohort"] ) >= 0
        //     });
        // },
        // basket_samples_session() {
        //     filter_samples = this.basket_samples_cohort;
        //     return filter_samples.filter((sample) => {
        //         if (this.filter_arrays["session"].length == this.all_arrays["session"].length) return true;
        //         return this.filter_arrays["session"].indexOf(sample["session"] ) >= 0
        //     });
        // },
        // basket_samples_category() {
        //     filter_samples = this.basket_samples_session;
        //     return filter_samples.filter((sample) => {
        //         if (this.filter_arrays["data-category"].length == this.all_arrays["data-category"].length) return true;
        //         return this.filter_arrays["data-category"].indexOf(sample["data-category"] ) >= 0
        //     });
        // },
        // basket_samples_type() {
        //     filter_samples = this.basket_samples_category;
        //     return filter_samples.filter((sample) => {
        //         if (this.filter_arrays["data-type"].length == this.all_arrays["data-type"].length) return true;
        //         return this.filter_arrays["data-type"].indexOf(sample["data-type"] ) >= 0
        //     });
        // },
        // basket_samples_age() {
        //     filter_samples = this.basket_samples_type;
        //     return filter_samples.filter((sample) => {
        //         if (this.filter_arrays["age"].length == this.all_arrays["age"].length) return true;
        //         return this.filter_arrays["age"].indexOf(sample["age"] ) >= 0
        //     });
        // },
        // basket_samples_count() {
        //     return this.basket_samples_age.length
        // },
        // basket_participants_count() {
        //     var basket_participants = this.basket_samples_age.map((m) => (m["ppn"]));
        //     var basket_participants_list = [...new Set(basket_participants)]
        //     return basket_participants_list.length
        // },

    },
    methods: {
        addToBasket() {

            // Add to basket from table view
            if (this.selected_component == 'table') {
                var selected_shortnames = this.included_measures.map(function(measure) {
                    return measure["short-name"];
                });

                var new_basket_item =  {
                    "cohort": [],
                    "data-category": [],
                    "session": [],
                    "data-type": [],
                    "age": [],
                    "short-name": selected_shortnames,
                }
                this.basket_length = this.basket.push(new_basket_item)
                this.showModal()
            }

            // Add to basket from table view
            if (this.selected_component == 'checkboxes') {

                this.filter_arrays
                
            }

            // for (var key in this.filter_arrays) {
            //     this.basket_arrays[key] = [...new Set(this.basket_arrays[key].concat(this.filter_arrays[key]))]
            // }
        },
        gotoPage(url) {
            window.location = url;
        },
        resetTable() {
            this.search_text = ""
            this.search_text_tags = []
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
        exportTable(format) {
            downloadArrayAsFormat(this.included_measures, format, "guts_metadata")
        },
        toggleChecks(name) {
            this.filter_toggles[name] = !this.filter_toggles[name]
            if (this.filter_toggles[name]) {
                this.filter_arrays[name] = this.all_arrays[name]
            }
            else {
                this.filter_arrays[name] = []
            }
        },
        showModal() {
            this.$refs['added-item-modal'].show()
        },
        hideModal() {
            this.$refs['added-item-modal'].hide()
        },
        viewBasket() {
            this.$refs['added-item-modal'].hide()
            this.selected_component = 'basket'
        },
        filterSamples() {
            var starting_samples = this.included_samples;
        }
    },
    beforeMount() {
        // Load text for headings/paragraphs
        measure_data_file = 'data/measure_data.json'
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
            this.measure_shortnames = this.measure_data.map((m) => (m["short-name"]));
            this.measure_data_loaded = true;
            this.measure_headings = [
                {
                    key: "short-name",
                    label: "Code",
                },
                {
                    key: "long-name",
                    label: "Name",
                },
                {
                    key: "description",
                    label: "Description",
                },
                {
                    key: "data-type",
                    label: "Type",
                },
                {
                    key: "data-category",
                    label: "Category",
                }
            ]
            participant_data_file = 'data/participant_data.json'
            return fetch(participant_data_file)
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
            // Loop through all participants and create sample data
            for (var i=0; i<this.participant_data.length; i++) {
                part = this.participant_data[i]
                // Loop through all measure shortnames
                for (var m=0; m<this.measure_shortnames.length; m++) {
                    m_code = this.measure_shortnames[m]
                    // skip measure if it is not collected for the participant
                    if (!part.hasOwnProperty(m_code) || !part[m_code]) {
                        continue
                    }
                    // construct participant_measure object
                    var part_measure = {
                        "ppn": part["ppn"],
                        "cohort": part["cohort"] ,
                        "session": part["session"] ,
                        "age": part["age"],
                        "short-name": m_code,
                    }
                    // get corresponding measure from short-name
                    var measure = this.measure_data.find(x => x["short-name"] === m_code);
                    // complete short-name associated fields
                    if (measure) {
                        part_measure["data-type"] = measure["data-type"]
                        part_measure["data-category"] = measure["data-category"]
                    } else {
                        part_measure["data-type"] = null
                        part_measure["data-category"] = null
                    }
                    this.participant_measures.push(part_measure)
                }
            }
            this.participant_measures_loaded = true;

            // Now we need to load all user input options
            var all_options = ["cohort", "session", "data-type", "data-category", "age"]
            for (var x=0; x<all_options.length; x++) {
                var option = all_options[x]
                var all_opt = "all-" + option
                var opt_list = option + "-list"
                var opt_options = option + "-options"

                this[all_opt] = this.participant_measures.map(function(pm) {
                    return pm[option];
                });
                this[opt_list] = [...new Set(this[all_opt])].sort()
                this[opt_options] = this[opt_list].map((item, idx) => (
                    {'value': item, 'text': makeReadable(item)}
                ))
                this[opt_options].unshift({value: 'all', text: 'All'})
                this.all_arrays[option] = this[opt_list]
                this.filter_arrays[option] = this.all_arrays[option]
            }
            // age min and max
            this.all_ages = this.participant_measures.map(function(pm) {
                return pm["age"];
            });
            this.age_list = [...new Set(this.all_ages)].sort()
            this.age_min = Math.min.apply(null, this.age_list)
            this.age_max = Math.max.apply(null, this.age_list)

            this.filter_age_min = this.age_min
            this.filter_age_max = this.age_max
            console.log(this)
            this.all_options_loaded = true;

        })
    },
});
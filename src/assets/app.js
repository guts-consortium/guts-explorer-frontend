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
            "data_category": true,
            "session": true,
            "data_type": true,
            "age": true,
            "state": true,
        },
        // Note: the keys and initial values of the all_arrays and filter_arrays objects
        // below have to be declared here (as opposed to just `all_arrays: {}`) because
        // otherwise these arrays won't be reactive. This changes in Vue 3.
        all_arrays: {
            "cohort": [],
            "data_category": [],
            "session": [],
            "data_type": [],
            "age": [],
            "short_name": [],
            "state": [],
        },
        filter_arrays: {
            "cohort": [],
            "data_category": [],
            "session": [],
            "data_type": [],
            "age": [],
            "short_name": [],
            "state": [],
        },
        filter_age_min: null,
        filter_age_max: null,
        age_min: null,
        age_max: null,
        all_options_loaded: false,
        basket_arrays: {
            "cohort": [],
            "data_category": [],
            "session": [],
            "data_type": [],
            "age": [],
            "short_name": [],
            "state": [],
        },
        basket: [],
        basket_length: 0,
        text_keys: {
            "cohort": "Cohort",
            "data_category": "Data category",
            "session": "Session",
            "data_type": "Data type",
            "age": "Age",
            "short_name": "Short name",
            "state": "Data state",

        },
        text_keys_multiple: {
            "cohort": "Cohorts",
            "data_category": "Data categories",
            "session": "Sessions",
            "data_type": "Data types",
            "age": "Ages",
            "short_name": "Short names",
            "state": "Data states",
        },
        item_index_to_delete: null,
        file_metadata: null,
        checkout_form_state: {},
        checkout_form_data: {},
        // basket checkout data
        name: '',
        nameState: null,
        affiliation: '',
        members: '',
        email: '',
        title: '',
        description: '',
        date: null,
        comments: '',
        status: '',    
    },
    computed: {
        included_measures_tags() {
            var filter_measures = this.measure_data;
            return filter_measures.filter((c) => {
                if (this.search_text_tags.length == 0) return true;
                return this.search_text_tags.some((v) =>
                    c["short_name"].toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c["long_name"].toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                    c["description"].toLowerCase().indexOf(v.toLowerCase()) >= 0
                );
            });
        },
        included_measures() {
            return this.included_measures_tags
        },
        // other
        category_check_icon() {
            if (this.filter_toggles["data_category"]) {
                return "fas fa-check"
            }
            return "fas fa-minus"
        },
        type_check_icon() {
            if (this.filter_toggles["data_type"]) {
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
        state_check_icon() {
            if (this.filter_toggles["state"]) {
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
                if (this.filter_arrays["data_category"].length == this.all_arrays["data_category"].length) return true;
                return this.filter_arrays["data_category"].indexOf(sample["data_category"] ) >= 0
            });
        },
        filtered_samples_type() {
            filter_samples = this.filtered_samples_category;
            return filter_samples.filter((sample) => {
                if (this.filter_arrays["data_type"].length == this.all_arrays["data_type"].length) return true;
                return this.filter_arrays["data_type"].indexOf(sample["data_type"] ) >= 0
            });
        },
        filtered_samples_age() {
            filter_samples = this.filtered_samples_type;
            return filter_samples.filter((sample) => {
                if (this.filter_arrays["age"].length == this.all_arrays["age"].length) return true;
                return this.filter_arrays["age"].indexOf(sample["age"] ) >= 0
            });
        },
        filtered_samples_state() {
            // sample["state"] is an array with ["primary", "derivative"]
            filter_samples = this.filtered_samples_age;
            return filter_samples.filter((sample) => {
                if (this.filter_arrays["state"].length == this.all_arrays["state"].length) return true;
                return  this.filter_arrays["state"].filter(value => sample['state'].includes(value)).length > 0
            });
        },
        filtered_samples_count() {
            return this.filtered_samples_state.length
        },
        filtered_participants_count() {
            var filtered_participants = this.filtered_samples_state.map((m) => (m["subject"]));
            var filtered_participants_list = [...new Set(filtered_participants)]
            return filtered_participants_list.length
        },
        basket_stats() {
            file_list = []
            item_samples = []
            item_files = []
            file_keys_to_use = ["data_category", "session", "data_type", "short_name"]

            for (var i=0; i<this.basket.length; i++){
                var item = this.basket[i]
                var samples = this.participant_measures
                var files = this.file_metadata
                // for all keys ["cohort","data_category","session","data_type","age","short_name","state"] in basket item:
                // filter all samples by key, recursively
                // filter all files by key, recursively, if key is in file metadata keys
                // handle state separately
                for (var key in item) {
                    var value = item[key]
                    if (key == "state") {
                        samples = this.filterSamplesBasketState(samples, key, value)
                    } else {
                        samples = this.filterSamplesBasket(samples, key, value)
                    }
                    if (file_keys_to_use.indexOf(key) >= 0) {
                        files = this.filterFilesBasket(files, key, value)
                    }
                    if (key == "state") {
                        // corresponding key in file metadata is "file_state"
                        files = this.filterFilesBasket(files, "file_state", value)
                    }
                }
                item_samples.push(samples)
                item_files.push(files)
            }
            var item_files_names = []
            var basket_samples = []
            var basket_files = []
            for (var i=0; i<this.basket.length; i++){
                
                basket_samples = basket_samples.concat(item_samples[i])
                
                item_files_names.push(
                    item_files[i].map(function(file) {
                        return file["file_path"];
                    })
                )
                basket_files = basket_files.concat(item_files_names[i])
            }

            basket_samples = [...new Set(basket_samples)]

            var filtered_participants = basket_samples.map((m) => (m["subject"]));
            var basket_participants = [...new Set(filtered_participants)]

            basket_files = [...new Set(basket_files)]

            return {
                samples: basket_samples,
                participants: basket_participants,
                files: basket_files
            }
        }
    },
    methods: {
        filterSamplesBasket(samples, key, value) {
            return samples.filter((sample) => {
                if (value.length == this.all_arrays[key].length) return true;
                return value.indexOf(sample[key] ) >= 0
            });

        },
        filterSamplesBasketState(samples, key, value) {
            return samples.filter((sample) => {
                if (value.length == this.all_arrays[key].length) return true;
                return  value.filter(val => sample[key].includes(val)).length > 0
            });
        },
        filterFilesBasket(files, key, value) {
            const k = key == "file_state" ? "state" : key
            return files.filter((file) => {

                if (value.length == this.all_arrays[k].length) return true;
                return value.indexOf(file[key] ) >= 0
            });
        },
        addToBasket() {
            // Add to basket from table view
            if (this.selected_component == 'table') {
                var selected_shortnames = this.included_measures.map(function(measure) {
                    return measure["short_name"];
                });
                var new_basket_item =  {
                    "cohort": this.all_arrays['cohort'],
                    "data_category": this.all_arrays["data_category"],
                    "session": this.all_arrays["session"],
                    "data_type": this.all_arrays["data_type"],
                    "age": this.all_arrays["age"],
                    "short_name": selected_shortnames,
                    "state": this.all_arrays["state"],
                }
                this.basket_length = this.basket.push(new_basket_item)
                this.showModal('added-item-modal')
            }
            // Add to basket from checkboxes view
            if (this.selected_component == 'checkboxes') {
                var new_basket_item =  {
                    "cohort": this.filter_arrays['cohort'],
                    "data_category": this.filter_arrays['data_category'],
                    "session": this.filter_arrays['session'],
                    "data_type": this.filter_arrays['data_type'],
                    "age": this.filter_arrays['age'],
                    "short_name": this.measure_shortnames,
                    "state": this.filter_arrays['state'],
                }
                this.basket_length = this.basket.push(new_basket_item)
                this.showModal('added-item-modal') 
            }
        },
        deleteBasketItemCheck(index) {
            this.item_index_to_delete = index;
            this.showModal('delete-item-modal')
        },
        deleteBasketItem(index) {
            this.basket.splice(index, 1)
            this.hideModal('delete-item-modal')
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
        showModal(modal_ref) {
            this.$refs[modal_ref].show()
        },
        hideModal(modal_ref) {
            this.$refs[modal_ref].hide()
        },
        viewBasket() {
            this.$refs['added-item-modal'].hide()
            this.selected_component = 'basket'
        },
        filterSamples() {
            var starting_samples = this.included_samples;
        },
        checkoutFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.nameState = valid
            return valid
        },
        resetCheckoutModal() {
            this.name = ''
            this.nameState = null
        },
        handleCheckoutOk(bvModalEvent) {
            // Prevent modal from closing
            bvModalEvent.preventDefault()
            // Trigger submit handler
            this.handleCheckoutSubmit()
        },
        handleCheckoutSubmit() {
            // Exit when the form isn't valid
            if (!this.checkoutFormValidity()) {
                return
            }
            // Push the name to submitted names
            var dl_object = {
                name: this.name,
                files: this.basket_stats.files
            }
            downloadArrayAsFormat(dl_object, "json", "my_guts_basket")
            // Hide the modal manually
            this.$nextTick(() => {
                this.$bvModal.hide('basket-checkout-modal')
            })
        }
    },
    beforeMount() {
        // Load text for headings/paragraphs
        // measure_data_file = 'data/measure_data.json'
        measure_data_file = 'data/guts-measure-overview.json'
        fetch(measure_data_file)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error(
                    "ERROR: measure_data.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.measure_data = responseJson;
            this.measure_shortnames = this.measure_data.map((m) => (m["short_name"]));
            this.measure_data_loaded = true;
            this.measure_headings = [
                {
                    key: "short_name",
                    label: "Code",
                },
                {
                    key: "long_name",
                    label: "Name",
                },
                {
                    key: "description",
                    label: "Description",
                },
                {
                    key: "data_type",
                    label: "Type",
                },
                {
                    key: "data_category",
                    label: "Category",
                }
            ]
            participant_data_file = 'data/guts-subject-level-metadata.json'
            return fetch(participant_data_file)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error(
                    "ERROR: participant_data.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.participant_data = responseJson;
            console.log("NUMBER OF PARTICIPANTS:")
            console.log(this.participant_data.length)
            // Loop through all participants and create sample data
            var p = 0
            for (var i=0; i<this.participant_data.length; i++) {
                part = this.participant_data[i]
                if (part["cohort"] == null) {
                    console.log(`Participant without cohort: ${part['subject']}`)
                    continue;
                }
                // Loop through all measure shortnames
                for (var m=0; m<this.measure_shortnames.length; m++) {
                    m_code = this.measure_shortnames[m]
                    // skip measure if it is not collected for the participant
                    // need to check for both primary and derivative state, only skip if both are 0
                    if (!part.hasOwnProperty(m_code) || (!part[m_code]["primary"] && !part[m_code]["derivative"]) ) {
                        continue

                    }
                    // construct participant_measure object
                    // get data states:
                    var states = []
                    if (part[m_code]["primary"]) {
                        states.push("primary")
                    }
                    if (part[m_code]["derivative"]) {
                        states.push("derivative")
                    }
                    
                    var part_measure = {
                        "subject": part["subject"],
                        "cohort": part["cohort"] ,
                        "session": part["session"] ,
                        "age": part["age"],
                        "short_name": m_code,
                        "state": states,
                    }
                    // get corresponding measure from short_name
                    var measure = this.measure_data.find(x => x["short_name"] === m_code);
                    // complete short_name associated fields
                    if (measure) {
                        part_measure["data_type"] = measure["data_type"]
                        part_measure["data_category"] = measure["data_category"]
                    } else {
                        part_measure["data_type"] = null
                        part_measure["data_category"] = null
                    }
                    p+=1
                    this.participant_measures.push(part_measure)
                }
            }
            this.participant_measures_loaded = true;

            // Now we need to load all user input options
            var all_options = ["cohort", "session", "data_type", "data_category", "age"]
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

            // states
            this.all_states = ["primary", "derivative"]
            this.state_list = ["primary", "derivative"]
            this.state_options = [
                {value: 'all', text: 'All'},
                {value: "primary", text: "Primary"},
                {value: "derivative", text: "Derivative"}
            ]
            this.all_arrays["state"] = this.state_list
            this.filter_arrays["state"] = this.all_arrays["state"]
            file_metadata_file = 'data/guts-file-level-metadata.json'
            return fetch(file_metadata_file)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error(
                    "ERROR: file_metadata.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.file_metadata = responseJson;
            this.all_options_loaded = true;
        })
    },
});
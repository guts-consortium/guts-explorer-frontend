/***********/
// Vue app //
/***********/
var all_respondents = [
    "child",
    "other parent",
    "primary parent",
]

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
    "Wave 1️⃣",
    "Wave 2️⃣",
    "Wave 3️⃣",
    "Wave 4️⃣",
    "Wave 5️⃣",
    "Wave 6️⃣",
    "Wave 🦠",
]
var all_sessions_short = [
    "0",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "🦠",
]

var fields = [
    "short_name",
    "long_name",
    "measure_category",
    "measure_type",
    "respondents",
]
fields.forEach(function(el, idx, arr) {
    arr[idx] = {key: el, sortable: false};
    if (idx == 1) {
        arr[idx].thStyle = { fontWeight: 'bold', fontStyle: 'italic', width: '25%'}    
    } else {
        arr[idx].thStyle = { fontWeight: 'bold', fontStyle: 'italic'}
    }
    
  });
fields = fields.concat([{ key: 'cohorts', label: 'Cohorts', sortable: false, thStyle: { fontWeight: 'bold', fontStyle: 'italic', width: '6%'}}])
fields = fields.concat([{ key: 'sessions', label: 'Sessions', sortable: false, thStyle: { fontWeight: 'bold', fontStyle: 'italic', width: '14%'}}])
fields = fields.concat([{ key: 'info', label: 'Info', sortable: false, thStyle: { fontWeight: 'bold', fontStyle: 'italic', width: '4%'}}])
console.log(fields)

var explorer = new Vue({
    el: "#explorer-table",
    data: {
        categories: cats,
        tabIndex: 0,
        measure_data: {},
        measure_pwpc_data: {},
        measures_loaded: false,
        measures_pwpc_loaded: false,
        cohort: "mcc",
        fields_to_display: fields,
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
        modal_details: {
            cohort: '-',
            session: '-',
            measure_category: '-',
            measure_name: '-',
            measure_shortname: '-',
            respondents: '-',
            description: '-',
            references: '-',
        },
        modal_details_names: {
            cohort: 'Cohorts',
            session: 'Sessions',
            measure_category: 'Measure Category',
            measure_name: 'Measure Name',
            measure_shortname: 'Measure Shortname',
            respondents: 'Respondents',
            description: 'Description',
            references: 'References',
        },
        modal_keys_basic: ['cohort', 'session', 'measure_category', 'measure_name', 'respondents'],
        cohort_options: [
            { value: 'ecc', text: 'ECC' },
            { value: 'mcc', text: 'MCC' },
        ],
        all_sessions_short: all_sessions_short,
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
            return this.measure_data.filter((c) => {
              if (this.search_text == "") return true;
              return (
                c.short_name.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0 ||
                c.long_name.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0
              );
            });
        },
        filtered_measures_category() {
            filter_measures = this.filtered_measures_search;
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

        // filtered_measures_search() {
        //     return this.measure_data.filter((c) => {
        //       if (this.search_text == "") return true;
        //       return (
        //         c.short_name.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0 ||
        //         c.long_name.toLowerCase().indexOf(this.search_text.toLowerCase()) >= 0
        //       );
        //     });
        // },
        // category_short_name: function () {
        //     return this.category.short_name
        // },
        // measure_short_names: function () {
        //     return Object.keys(this.measure_pwpc_data[this.cohort][this.category["short_name"]])
        // },
    },
    methods: {
        exportTable() {
            downloadObjectAsJson(this.filtered_measures_search, "lcid_metadata.json")
        },
        showInfoModal(idx) {
            newDeets = {}
            measure = this.filtered_measures_type[idx]
            newDeets.measure_shortname = measure.short_name
            newDeets.measure_name = measure.long_name
            newDeets.measure_category = measure.measure_category
            newDeets.description = measure.description ? measure.description : '-'
            newDeets.measure_name = measure.long_name
            newDeets.respondents = measure.respondent
            newDeets.respondents = newDeets.respondents.replace('pp', 'Primary parent')
            newDeets.respondents = newDeets.respondents.replace('op', 'Other parent')
            newDeets.respondents = newDeets.respondents.replace('c', 'Child')
            newDeets.respondents = newDeets.respondents.replace('-', ', ')
            newDeets.references = measure.reference ? measure.reference : ''
            newDeets.doi = measure.doi
            this.updateDetails(newDeets)
            this.$refs['info-modal'].show()
            console.log(this.filtered_measures_search[idx])
        },
        updateDetails(newDeets) {
            Object.keys(newDeets).forEach(k => {
                console.log(k)
                this.modal_details[k] = newDeets[k]
            })
        },
        clearDetails() {
            newDeets = {}
            newDeets.cohort = '-'
            newDeets.measure_category = '-'
            newDeets.session = '-'
            newDeets.measure_shortname = '-'
            newDeets.description = '-'
            newDeets.measure_name = '-'
            newDeets.respondents = '-'
            newDeets.references = '-'
            newDeets.doi = null
            this.updateDetails(newDeets)
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
        containsNumbers(str) {
            return /[1-9]/.test(str);
        },
        containsDigit(dig, str) {
            const regex = new RegExp(dig, 'g')
            res = regex.test(str)
            return res
        }
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
            types_list = this.measure_data.map(function(measure) {
                return measure["measure_type"];
            });
            this.all_arrays["type"] = [...new Set(types_list)]
            this.all_arrays["type"] = this.all_arrays["type"].sort()
            this.filter_arrays["type"] = this.all_arrays["type"]
            this.measures_loaded = true;
        })
        .catch((error) => {
            console.log(error);
        });

        // Load measure per wave/cohort data
        measure_pwpc_data_file = 'inputs/processed_data/measure_per_wave_per_cohort.json'
        fetch(measure_pwpc_data_file)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(
                    "WARNING: measure_per_wave_per_cohort.json file could not be loaded"
                );
            }
        })
        .then((responseJson) => {
            this.measure_pwpc_data = responseJson;
            this.measures_pwpc_loaded = true;
            console.log(this.measure_pwpc_data)
        })
        .catch((error) => {
            console.log(error);
        });
        
    },
});
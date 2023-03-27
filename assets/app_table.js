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
var fields = [
    "short_name",
    "long_name",
    "measure_category",
    "measure_type",
    "respondents",
]
fields.forEach(function(el, idx, arr) {
    arr[idx] = {key: el, sortable: false};
    if (idx == 1) { // long name
        arr[idx].thStyle = { fontWeight: 'bold', fontStyle: 'italic', width: '25%'}
    } else if (idx == 4) { // respondents
        arr[idx].thStyle = { fontWeight: 'bold', fontStyle: 'italic', width: '11%'}
    } else {
        arr[idx].thStyle = { fontWeight: 'bold', fontStyle: 'italic'}
    }
    
  });
fields = fields.concat([{ key: 'cohorts', label: 'Cohorts', sortable: false, thStyle: { fontWeight: 'bold', fontStyle: 'italic', width: '6%'}}])
fields = fields.concat([{ key: 'sessions', label: 'Sessions', sortable: false, thStyle: { fontWeight: 'bold', fontStyle: 'italic', width: '15%'}}])
fields = fields.concat([{ key: 'info', label: 'Info', sortable: false, thStyle: { fontWeight: 'bold', fontStyle: 'italic', width: '4%'}}])

var explorer = new Vue({
    el: "#explorer-table",
    data: {
        categories: cats,
        tabIndex: 0,
        measure_data: {},
        measures_loaded: false,
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
        search_tags: [],
        modal_details: {
            cohort: '-',
            session: '-',
            measure_category: '-',
            measure_type: '-',
            measure_name: '-',
            measure_shortname: '-',
            respondents: '-',
            description: '-',
            keywords: '-',
            references: '-',
        },
        modal_details_names: {
            cohort: 'Cohorts',
            session: 'Sessions',
            measure_category: 'Measure Category',
            measure_category: 'Measure Category',
            measure_type: 'Measure Type',
            measure_name: 'Measure Name',
            measure_shortname: 'Measure Shortname',
            respondents: 'Respondents',
            description: 'Description',
            keywords: 'Keywords',
            references: 'Measure sources',
        },
        modal_keys_basic: ['cohort', 'session', 'measure_category', 'measure_name', 'respondents'],
        cohort_options: [
            { value: 'ecc', text: 'ECC' },
            { value: 'mcc', text: 'MCC' },
        ],
        all_sessions_short: all_sessions_short,
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
    },
    methods: {
        addSearchTag(option) {
            this.search_tags.push(this.search_text);
            this.search_text = "";
        },
        removeSearchTag(tag) {
            idx = this.search_tags.indexOf(tag);
            if (idx > -1) {
                this.search_tags.splice(idx, 1);
            }
        },
        clearSearchTagText() {
            this.search_text = "";
        },
        exportTable(format) {
            downloadArrayAsFormat(this.filtered_measures_session, format, "lcid_metadata")
        },
        showInfoModal(idx) {
            newDeets = {}
            measure = this.filtered_measures_type[idx]
            newDeets.measure_shortname = measure.short_name
            newDeets.measure_name = measure.long_name
            newDeets.measure_category = measure.measure_category
            newDeets.description = measure.description ? measure.description : '-'
            newDeets.measure_type = measure.measure_type
            newDeets.session = ''
            for (var i=1; i<8; i++) {
                if (this.containsDigit(i, measure.ecc) || this.containsDigit(i, measure.mcc)) {
                    newDeets.session+= this.all_sessions_short[i] + ' '
                } else {
                    newDeets.session+= 'X '
                }

            }
            newDeets.cohort = ''
            for (var i=0; i< measure.cohorts.length; i++) {
                newDeets.cohort += measure.cohorts[i].toUpperCase() + ', '
            }
            newDeets.cohort = newDeets.cohort.substring(0, newDeets.cohort.length - 2);
            newDeets.measure_name = measure.long_name
            newDeets.respondents = measure.respondent
            newDeets.respondents = newDeets.respondents.replace('pp', 'Primary parent')
            newDeets.respondents = newDeets.respondents.replace('op', 'Other parent')
            newDeets.respondents = newDeets.respondents.replace('c', 'Child')
            newDeets.respondents = newDeets.respondents.replace('-', ', ')
            newDeets.references = measure.reference ? measure.reference : ''
            newDeets.doi = measure.doi
            newDeets.keywords = measure.keywords ? measure.keywords : '-'
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
            newDeets.keywords = '-'
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
    },
});
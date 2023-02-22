/***********/
// Vue app //
/***********/

var explorer = new Vue({
    el: "#explorer-mri",
    data: {
        categories: cats,
        tabIndex: 0,
        measure_data: {},
        measure_pwpc_data: {},
        measures_loaded: false,
        measures_pwpc_loaded: false,
        cohort: "mcc",
        fields_to_display: [
            "short_name",
            "long_name",
            "measure_category",
            "measure_type",
            "respondents",
            "ecc",
            "mcc",
        ],
        all_categories: categories_list,
        filter_categories: [],
        filter_types: [],
        search_text: "",
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
        all_types: function () {
            types_list = this.measure_data.map(function(measure) {
                return measure["measure_type"];
            });
            return [...new Set(types_list)]
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
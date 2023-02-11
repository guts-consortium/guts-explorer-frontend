/***********/
// Vue app //
/***********/



// Start Vue instance
var explorer = new Vue({
    el: "#explorer",
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


// async created() {
//     file = getFilePath(
//       this.$route.params.dataset_id,
//       this.$route.params.dataset_version,
//       null
//     );
//     var app = this.$root;
//     response = await fetch(file);
//     text = await response.text();
//     app.selectedDataset = JSON.parse(text);
//     this.dataset_ready = true;
//     if (
//       this.$root.selectedDataset.hasOwnProperty("subdatasets") &&
//       this.$root.selectedDataset.subdatasets instanceof Array &&
//       this.$root.selectedDataset.subdatasets.length > 0
//     ) {
//       subds_json = await grabSubDatasets(app);
//       subds_json.forEach((subds, index) => {
//         if (subds_json[index] != "unavailable") {
//           sorted_extractors = subds_json[index].extractors_used.sort(
//             (a, b) => b.extraction_time - a.extraction_time
//           );
//           this.$root.selectedDataset.subdatasets[index].extraction_time =
//             sorted_extractors[0].extraction_time;
//           this.$root.selectedDataset.subdatasets[index].name =
//             subds_json[index].name;
//           this.$root.selectedDataset.subdatasets[index].short_name =
//             subds_json[index].short_name;
//           this.$root.selectedDataset.subdatasets[index].doi =
//             subds_json[index].doi;
//           this.$root.selectedDataset.subdatasets[index].license =
//             subds_json[index].license;
//           this.$root.selectedDataset.subdatasets[index].authors =
//             subds_json[index].authors;
//           this.$root.selectedDataset.subdatasets[index].keywords =
//             subds_json[index].keywords;
//           this.$root.selectedDataset.subdatasets[index].available = "true";
//         } else {
//           this.$root.selectedDataset.subdatasets[index].available = "false";
//         }
//       });
//       this.subdatasets_ready = true;
//     } else {
//       this.$root.selectedDataset.subdatasets = [];
//       this.subdatasets_ready = true;
//     }
//   },
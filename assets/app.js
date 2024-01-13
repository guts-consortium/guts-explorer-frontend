/***********/
// Vue app //
/***********/



// Start Vue instance
var explorer = new Vue({
    el: "#measures",
    data: {
        measure_data: [],
        measure_headings: [],
        measure_data_loaded: false,
        search_text: "",
        search_text_tags: [],
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
    },
    methods: {
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
        })
    },
});
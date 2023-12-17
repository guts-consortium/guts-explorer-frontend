/***********/
// Vue app //
/***********/



// Start Vue instance
var explorer = new Vue({
    el: "#measures",
    data: {
        measure_data: {},
        measure_headings: [],
        measure_data_loaded: false,
        isCovid: false,
        isParenting: false,
        isHome: false,
        isDigital: false,
        isEEG: false,
        isMRI: false,
    },
    methods: {
        gotoPage(url) {
            window.location = url;
        },
        hoverHandlerCovid(state) {
            if (state) {
                this.isCovid = true
            }
            else {
                this.isCovid = false
            }
        },
        hoverHandlerParenting(state) {
            if (state) {
                this.isParenting = true;
            } else {
                this.isParenting = false;
            }
        },
        hoverHandlerHome(state) {
            if (state) {
                this.isHome = true;
            } else {
                this.isHome = false;
            }
        },
        hoverHandlerDigital(state) {
            if (state) {
                this.isDigital = true;
            } else {
                this.isDigital = false;
            }
        },
        hoverHandlerEEG(state) {
            if (state) {
                this.isEEG = true;
            } else {
                this.isEEG = false;
            }
        },
        hoverHandlerMRI(state) {
            if (state) {
                this.isMRI = true;
            } else {
                this.isMRI = false;
            }
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
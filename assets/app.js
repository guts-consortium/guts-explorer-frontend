/***********/
// Vue app //
/***********/



// Start Vue instance
var explorer = new Vue({
    el: "#explorer",
    data: {
        text_content: {},
        text_content_loaded: false,
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
        })
    },
});
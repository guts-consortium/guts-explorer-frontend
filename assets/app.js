/***********/
// Vue app //
/***********/



// Start Vue instance
var explorer = new Vue({
    el: "#explorer",
    data: {
        text_content: {},
        text_content_loaded: false,
    },
    methods: {
        gotoPage(url) {
            window.location = url;
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
        })
    },
});
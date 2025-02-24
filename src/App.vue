<template>
    <v-app>
        <v-main>
            <!-- ****** -->
            <!-- HEADER -->
            <!-- ****** -->
            <div class="header">
                <a href="/"><img src="/src/assets/img/logo_guts.svg" alt="" height="90"></a>
                &nbsp;&nbsp;
                <div class="push">
                    <h1><strong>GUTS Metadata Explorer</strong></h1>
                    <div class="menu-container">
                        <ul class="menu push">
                            <li @click="selected_component = 'home'" :class="{active: selected_component == 'home'}"><i class="fas fa-home"></i></li>
                            <li @click="selected_component = 'table'" :class="{active: selected_component == 'table'}"><i class="fas fa-bars"></i></li>
                            <li @click="selected_component = 'checkboxes'" :class="{active: selected_component == 'checkboxes'}"><i class="fas fa-list-check"></i></li>
                            <li @click="selected_component = 'basket'" :class="{active: selected_component == 'basket', hasitems: basket.length > 0 }">
                                <i class="fas fa-cart-shopping"></i>
                            </li>
                        </ul>
                        <auth-menu></auth-menu>
                    </div>
                </div>
            </div>
            <!-- ****************** -->
            <!-- SELECTED COMPONENT -->
            <!-- ****************** -->
            <span v-if="all_options_loaded">
                <div v-if="selected_component=='home'" style="text-align: center;">
                    <div class="home-header">
                        <h1 class="home-heading-1"><em>How do young people successfully grow up in an increasingly complex society?</em></h1>
                        <h1 class="home-heading-2"><em><a href="https://www.gutsproject.com/"> <i class="fas fa-arrow-up-right-from-square"></i> gutsproject.com</a></em></h1>
                    </div>
                    <br>
                    <div style="text-align:center"><h2><em> ... PAGE UNDER CONSTRUCTION ... </em></h2></div>
                </div>
                <div v-if="selected_component=='table'">
                    <GutsTable></GutsTable>
                </div>
                <div v-if="selected_component=='checkboxes'">
                    <GutsCheckboxes></GutsCheckboxes>
                </div>
                <div v-if="selected_component=='basket'">
                    <GutsBasket></GutsBasket>
                </div>
            </span>
            <!-- ****** -->
            <!-- FOOTER -->
            <!-- ****** -->
            <div class="footer">
                <div class="footer-funding">
                    <h4>Funding</h4>
                    <a href=""><img src="/src/assets/img/logo_funding.webp" alt="" height="90"></a>
                    <p><small>
                        GUTS is funded by the Dutch Ministry of Education, Culture and Science (OCW).
                        <br>Research programme: Gravitation
                        <br>File number: 024.005.011
                    </small>
                    </p>
                </div>
                <div>
                    <h4>Partners</h4>
                    <div class="partner-logos">
                        <a href=""><img src="/src/assets/img/logo_eur.png" alt="" height="50"></a>
                        <a href=""><img src="/src/assets/img/logo_unileiden.webp" alt="" height="50"></a>
                        <a href=""><img src="/src/assets/img/logo_groningen.webp" alt="" height="50"></a>
                        <a href=""><img src="/src/assets/img/logo_vrije.png" alt="" height="50"></a>
                        <a href=""><img src="/src/assets/img/logo_utrechtuni.webp" alt="" height="50"></a>
                        <a href=""><img src="/src/assets/img/logo_Amsterdam_UMC.webp" alt="" height="50"></a>
                        <a href=""><img src="/src/assets/img/logo_NIFN.webp" alt="" height="50"></a>
                        <a href=""><img src="/src/assets/img/logo_RADBOUDMC.webp" alt="" height="50"></a>
                        <a href=""><img src="/src/assets/img/logo_uva.webp" alt="" height="50"></a>
                    </div>
                </div>
            </div>
        </v-main>
    </v-app>
</template>

<script setup>
    import { provide, toRaw } from 'vue';
    import { ref, onBeforeMount, reactive } from 'vue'
    import { useBasket } from '@/composables/basket.js'
    import { makeReadable } from '@/modules/utils.js'
    import AuthMenu from '@/components/AuthMenu';

    const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
    const measure_data_file = `${backendUrl}/api/measures`
    const participant_data_file = `${backendUrl}/api/subjects`
    const file_metadata_file = `${backendUrl}/api/files`

    // Data
    var selected_component = ref("home"); // must be one of: home, table, checkboxes, basket
    var measure_data = ref([])
    var measure_shortnames = ref([])
    var measure_data_loaded = ref(false)
    var participant_data = ref([])
    var participant_measures = ref([])
    var participant_measures_loaded = ref(false)
    var all_arrays = reactive({})
    var filter_arrays = reactive({})
    var all_ages = ref(null)
    var age_list = ref(null)
    var age_min = ref(null)
    var age_max = ref(null)
    var filter_age_min = ref(null)
    var filter_age_max = ref(null)
    var all_states = ref(null)
    var state_list = ref(null)
    var state_options = ref(null)
    var all_data_category = ref(null)
    var data_category_list = ref(null)
    var data_category_options = ref(null)
    var file_metadata = ref([])
    var all_options_loaded = ref(false)
    const userInfo = ref(null)
    const isAuthenticated = ref(false)
    provide('isAuthenticated', isAuthenticated)

    const {
        basket,
        addToBasket,
        deleteBasketItem,
        getBasketStats
    } = useBasket(all_arrays, filter_arrays)

    provide('measure_data', measure_data)
    provide('all_arrays', all_arrays)
    provide('filter_arrays', filter_arrays)
    provide('participant_measures', participant_measures)
    provide('basket', basket)
    provide('addToBasket', addToBasket)
    provide('getBasketStats', getBasketStats)
    provide('selected_component', selected_component)
    provide('file_metadata', file_metadata)
    provide('deleteBasketItem', deleteBasketItem)
    provide('userInfo', userInfo)

    onBeforeMount( () => {
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
            measure_data.value = responseJson;
            measure_shortnames.value = measure_data.value.map((m) => (m["short_name"]?.trim()));
            measure_data_loaded.value = true;
            // data_catagory should be turned into an array, comma separated
            for (var i=0; i<measure_data.value.length; i++) {
                if (measure_data.value[i]["data_category"]) {
                    var new_cat = measure_data.value[i]["data_category"].trim().split(",").map((c) => (c.trim()));
                    measure_data.value[i]["data_category"] = new_cat
                    if (new_cat.length == 1 && new_cat[0] == "tba") {
                        console.log(
                            `data_category is 'tba' for: ${measure_data.value[i]["short_name"]}`
                        )   
                    }
                }
            }
            console.log(`OVERVIEW-LEVEL SUMMARY`)
            console.log("short_names:")
            console.log(`${measure_shortnames.value.length}`)
            console.log(`${measure_shortnames.value}`)
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
            participant_data.value = responseJson;
            var ps_with_measures = []
            var ps_without_measures = []
            var ps_used_measures = []
            var subjects = []
            // the participant_data is an array of participant-sessions
            for (var ps of participant_data.value) {
                // add to list of subjects
                var sub = ps["subject"]
                var ses = ps["session"]
                var subses = `${sub}-${ses}`
                if (subjects.indexOf(sub) < 0) {
                    subjects.push(sub)
                }
                var subses_has_measures = false
                for (var k of Object.keys(ps)) {
                    var f = ps[k]
                    if (!(typeof f === 'object' && !Array.isArray(f) && f !== null)) {
                        continue;
                    }
                    if (f["primary"] || f["derivative"]) {
                        if (ps_with_measures.indexOf(subses) < 0) {
                            ps_with_measures.push(subses)
                        }
                        subses_has_measures = true
                        ps_used_measures.push(k)
                    }
                }
                if (!subses_has_measures) {
                    ps_without_measures.push(subses)
                }

            }
            ps_used_measures = [...new Set(ps_used_measures)].sort()

            console.log("SUBJECT-LEVEL SUMMARY")
            console.log(`Number of participants: ${subjects.length}`)
            console.log(`Number of participant-sessions: ${participant_data.value.length}`)
            console.log(`Number of participant-sesssions with measures used: ${ps_with_measures.length}`)
            console.log("Participant-sesssions WITHOUT measures used:")
            console.log(ps_without_measures.length)
            console.log(ps_without_measures)
            console.log("Shortnames of measures used:")
            // meass = [...new Set(meass)].sort()
            console.log(ps_used_measures.length)
            console.log(ps_used_measures)
            
            
            var part, m_code
            // Loop through all participants and create sample data
            const cohorts = {
                "A": "eur",
                "B": "vu",
                "C": "lei",
                "D": "aumc",
            }
            var p = 0
            for (var i=0; i<participant_data.value.length; i++) {
                part = participant_data.value[i]
                if (part["cohort"] == null || Object.values(cohorts).indexOf(part["cohort"]) < 0) {
                    console.log(`Participant without cohort: ${part['subject']}`)
                    continue;
                }
                // Loop through all measure shortnames
                for (var m=0; m<measure_shortnames.value.length; m++) {
                    m_code = measure_shortnames.value[m]
                    // skip measure if it is not collected for the participant
                    // need to check for both primary and derivative state, only skip if both are 0
                    // TODO: check if we need to include raw state here as well, since it is included in measure overview
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
                    var measure = measure_data.value.find(x => x["short_name"] === m_code);
                    // complete short_name associated fields
                    if (measure) {
                        part_measure["data_type"] = measure["data_type"]
                        part_measure["data_category"] = measure["data_category"]
                        if (!part_measure["data_category"]) {
                            part_measure["data_category"] = []
                        }
                    } else {
                        part_measure["data_type"] = null
                        part_measure["data_category"] = []
                    }
                    p+=1
                    participant_measures.value.push(part_measure)
                }
            }
            participant_measures_loaded.value = true;
            console.log("Number of samples:")
            console.log(participant_measures.value.length)



            // Now we need to construct all user input options
            // 
            var all_options = ["cohort", "session", "data_type", "age", "short_name"]
            var all_options_obj = {}
            for (var x=0; x<all_options.length; x++) {
                var option = all_options[x]
                var all_opt = "all-" + option
                var opt_list = option + "-list"
                var opt_options = option + "-options"
                // Here, all options values are supposed to be either:
                //  - single string values (the default)
                //  - missing values (null or "na" or "not found" or "tba")
                //  - if the option == data_catagory, the value is an array ==> needs to be dealt with accordingly
                all_options_obj[all_opt] = participant_measures.value.map(function(pm) {
                    // if option==
                    return pm[option];
                });
                all_options_obj[opt_list] = [...new Set(all_options_obj[all_opt])].sort()
                // console.log(opt_list)
                // console.log(all_options_obj[opt_list])

                all_options_obj[opt_options] = []
                for (var z=0; z<all_options_obj[opt_list].length; z++) {
                    var item  = all_options_obj[opt_list][z]
                    // console.log(`item ${z}: ${item}`)
                    if (item) {
                        all_options_obj[opt_options] = all_options_obj[opt_options].concat({'value': item, 'text': makeReadable(item)})
                    }
                }
                all_options_obj[opt_options].unshift({value: 'all', text: 'All'})
                all_arrays[option] = all_options_obj[opt_list]
                filter_arrays[option] = all_arrays[option]
            }
            // age min and max
            all_ages.value = participant_measures.value.map(function(pm) {
                return pm["age"];
            });
            age_list.value = [...new Set(all_ages.value)].sort()
            age_min.value = Math.min.apply(null, age_list.value)
            age_max.value = Math.max.apply(null, age_list.value)
            filter_age_min.value = age_min.value
            filter_age_max.value = age_max.value

            // states
            all_states.value = ["primary", "derivative"]
            state_list.value = ["primary", "derivative"]
            state_options.value = [
                {value: 'all', text: 'All'},
                {value: "primary", text: "Primary"},
                {value: "derivative", text: "Derivative"}
            ]
            all_arrays["state"] = state_list.value
            filter_arrays["state"] = all_arrays["state"]


            // categories
            // console.log("NOW HANDLING CATEGORIES")
            all_data_category.value = []
            for (var y=0; y<participant_measures.value.length; y++) {
                var pm_y = participant_measures.value[y];
                var pm_cat = toRaw(pm_y["data_category"])
                if (pm_cat == null) {
                    console.log("Data category is null:")
                    console.log(pm_y)
                }
                
                all_data_category.value = all_data_category.value.concat(pm_cat)
                // state_list.value = ["primary", "derivative"]
            }
            data_category_list.value = [...new Set(all_data_category.value)].sort()
            data_category_options.value = [
                {value: 'all', text: 'All'},
            ]
            // console.log("Data category list")
            // console.log(data_category_list.value)
            for (var l=0; l<data_category_list.value.length; l++) {
                var item = data_category_list.value[l]
                // console.log(item)
                if (item) {
                    data_category_options.value.push(
                        {'value': item, 'text': makeReadable(item)}
                    )
                } else {
                    console.log("\tthis data category is null")
                }
            }
            all_arrays["data_category"] = data_category_list.value
            filter_arrays["data_category"] = all_arrays["data_category"]
            console.log(`All arrays:`)

            for (const [key, value] of Object.entries(all_arrays)) {
                console.log(key, value);
            }

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
            file_metadata.value = responseJson;
            // data_category should be turned into an array, comma separated
            for (var i=0; i<file_metadata.value.length; i++) {
                if (file_metadata.value[i]["data_category"]) {
                    var new_cat = file_metadata.value[i]["data_category"].trim().split(",").map((c) => (c.trim()));
                    file_metadata.value[i]["data_category"] = new_cat
                    if (new_cat.length == 1 && new_cat[0] == "tba") {
                            console.log(
                            `Data catergories for ${file_metadata.value[i]["file_name"]}:\n${new_cat}`
                        )   
                    }
                }
            }
            console.log("FILE-LEVEL SUMMARY")
            console.log("Number of files:")
            console.log(file_metadata.value.length)
            var measure_shortnames_fromfiles = file_metadata.value.map((m) => (m["short_name"]?.trim()));
            measure_shortnames_fromfiles = [...new Set(measure_shortnames_fromfiles)].sort()
            console.log(`Short names from files:`)
            console.log(`${measure_shortnames_fromfiles.length}`)
            console.log(`${measure_shortnames_fromfiles}`)
            
            all_options_loaded.value = true;
        })
    })

</script>

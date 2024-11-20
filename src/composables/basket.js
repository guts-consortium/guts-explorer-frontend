import { reactive, ref, inject} from 'vue'


export function useBasket(all_arrays, filter_arrays) {

    const basket =  reactive([])
    var basket_length

    function addToBasket(addFrom, included_measures) {
        // Add to basket from table view
        if (addFrom == 'table') {
            var selected_shortnames = included_measures.map(function(measure) {
                return measure["short_name"];
            });
            var new_basket_item =  {
                "cohort": all_arrays['cohort'],
                "data_category": all_arrays["data_category"],
                "session": all_arrays["session"],
                "data_type": all_arrays["data_type"],
                "age": all_arrays["age"],
                "short_name": selected_shortnames,
                "state": all_arrays["state"],
            }
            basket_length = basket.push(new_basket_item)
        }
        // Add to basket from checkboxes view
        if (addFrom == 'checkboxes') {
            var new_basket_item =  {
                "cohort": filter_arrays['cohort'],
                "data_category": filter_arrays['data_category'],
                "session": filter_arrays['session'],
                "data_type": filter_arrays['data_type'],
                "age": filter_arrays['age'],
                "short_name": all_arrays["short_name"],
                "state": filter_arrays['state'],
            }
            basket_length = basket.push(new_basket_item)
        }
    }

    function deleteBasketItem(index) {
        basket.splice(index, 1)
    }

    function getBasketStats(participant_measures, file_metadata) {
        console.log("getting basket stats")
        var file_list = []
        var item_samples = []
        var item_files = []
        var file_keys_to_use = ["cohort", "data_category", "session", "data_type", "age", "short_name"]

        console.log(all_arrays)
        for (var i=0; i<basket.length; i++){
            var item = basket[i]
            var samples = participant_measures
            var files = file_metadata
            // for all keys ["cohort","data_category","session","data_type","age","short_name","state"] in basket item:
            // filter all samples by key, recursively
            // filter all files by key, recursively, if key is in file metadata keys
            // handle state separately
            for (var key in item) {
                var value = item[key]
                if (key == "state") {
                    samples = filterSamplesBasketState(samples, key, value)
                } else {
                    samples = filterSamplesBasket(samples, key, value)
                }

                if (key == "state") {
                    // corresponding key in file metadata is "file_state"
                    files = filterFilesBasket(files, "file_state", value)
                } else {
                    files = filterFilesBasket(files, key, value)
                }
                
            }
            item_samples.push(samples)
            item_files.push(files)
        }
        var item_files_names = []
        var basket_samples = []
        var basket_filenames = []
        var basket_files = []
        var basket_providers = []
        for (var i=0; i<basket.length; i++){
            
            basket_samples = basket_samples.concat(item_samples[i])
            
            item_files_names.push(
                item_files[i].map(function(file) {
                    return file["file_path"];
                })
            )
            basket_filenames = basket_filenames.concat(item_files_names[i])
            basket_files = basket_files.concat(item_files[i])
            // this will contain many duplicates, but it's not a probem if it
            // is only used for mapping of other fields, e.g. explorer_provider below
        }

        const basket_files_unique = [...new Map(basket_files.map(item =>
            [item["file_path"], item])).values()];

        basket_samples = [...new Set(basket_samples)]

        var filtered_participants = basket_samples.map((m) => (m["subject"]));
        var basket_participants = [...new Set(filtered_participants)]

        basket_filenames = [...new Set(basket_filenames)]

        var filtered_providers = basket_files.map((m) => (m["explorer_provider"]));
        var basket_providers = [...new Set(filtered_providers)]


        return {
            samples: basket_samples,
            participants: basket_participants,
            files: basket_files_unique,
            filenames: basket_filenames,
            providers: basket_providers
        }
    }

    function filterSamplesBasket(samples, key, value) {
        // console.log(`Filtering samples with key: ${key} and value:`, value);

        if (!Array.isArray(samples)) {
            console.error('samples is not an array:', samples);
            return [];
        }
    
        if (!all_arrays[key]) {
            console.error(`all_arrays[${key}] is undefined or null`);
            console.error(all_arrays)
            return samples; // or handle the error as needed
        }

        return samples.filter((sample) => {
            if (value.length == all_arrays[key].length) return true;
            return value.indexOf(sample[key] ) >= 0
        });
    }

    function filterSamplesBasketState(samples, key, value) {
        return samples.filter((sample) => {
            if (value.length == all_arrays[key].length) return true;
            return  value.filter(val => sample[key].includes(val)).length > 0
        });
    }

    function filterFilesBasket(files, key, value) {
        const k = key == "file_state" ? "state" : key

        // console.log(`Filtering files with key: ${k} and value:`, value);

        if (!Array.isArray(files)) {
            console.error('files is not an array:', files);
            return [];
        }
        if (!all_arrays[k]) {
            console.error(`all_arrays[${k}] is undefined or null`);
            console.error(all_arrays)
            return files; // or handle the error as needed
        }
        return files.filter((file) => {
            if (value.length == all_arrays[k].length) return true;
            return value.indexOf(file[k] ) >= 0
        });
    }

    return {
        basket,
        addToBasket,
        deleteBasketItem,
        getBasketStats
    }

}
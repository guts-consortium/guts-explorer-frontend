import { reactive, ref, inject} from 'vue'

export function useBasket(all_arrays, filter_arrays) {

    const basket =  reactive([])
    var basket_length

    function filterSamplesBasket(samples, key, value) {
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
        return files.filter((file) => {

            if (value.length == all_arrays[k].length) return true;
            return value.indexOf(file[key] ) >= 0
        });
    }

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
                "short_name": this.measure_shortnames, // TODO
                "state": filter_arrays['state'],
            }
            basket_length = basket.push(new_basket_item)
        }
    }

    function deleteBasketItemCheck(index) {
        this.item_index_to_delete = index;
        this.showModal('delete-item-modal')
    }

    function deleteBasketItem(index) {
        basket.splice(index, 1)
        this.hideModal('delete-item-modal')
    }


    return {
        basket,
        filterSamplesBasket,
        filterSamplesBasketState,
        filterFilesBasket,
        addToBasket,
        deleteBasketItem,
        deleteBasketItemCheck
    }

}
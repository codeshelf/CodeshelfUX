import {getFacilityContext} from "data/csapi";
import Search from "components/common/Search";
import {fromJS} from "immutable";

export default class WorkInstructionSearch extends Search {

    doSearch() {
        getFacilityContext().findWorkInstructions({}).then((wis) =>{
            let enhancedWIs = fromJS(wis).map((wi) => {
                let gtin = wi.get("gtin");
                if (gtin && gtin.length >= 4) {
                    return wi.set("store", gtin.substring(0,4));
                } else {
                    return wi;
                }
            });
            this.onUpdated(enhancedWIs);
        });
    }
}

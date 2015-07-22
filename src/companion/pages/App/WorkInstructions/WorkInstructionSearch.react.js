import {getFacilityContext} from "data/csapi";
import Search from "components/common/Search";

export default class WorkInstructionSearch extends Search {

    doSearch() {
        getFacilityContext().findWorkInstructions({}).then((wis) =>{
            this.onUpdated(wis);
        });
    }
}

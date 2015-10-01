import {expect} from "chai";
import sd from "skin-deep";
import WorkInstructionIBox from "../WorkInstructionIBox";
import State from "lib/state";
import {Map} from "immutable";

describe("WorkInstructionIBox", () => {
    let appState = new State({pivot: {workInstructions: []}});

        /* it("Renders default", () => {

        let tree = sd.shallowRender(<WorkInstructionIBox state={appState}/>);
    });
*/
    /*
    it("Show progress", () => {
        let tree = sd.shallowRender(<WorkInstructionIBox state={appState}/>);
        let instance = tree.getMountedInstance();
        instance.handleResultsUpdated([{notempty: true}], 100);
        instance.forceUpdate();
        let comp = tree.findComponentLike("SearchStatus", {});
        expect(comp.props.results.isEmpty()).to.be.false;
    });
*/
});

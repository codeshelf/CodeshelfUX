import {expect} from "chai";
import sd from "skin-deep";
import {SingleCellIBox} from "components/common/IBox";

describe("SingleCellIBox", () => {
    it("Shows refresh when is refreshing", () => {
        const isRefreshing = true;
        const onRefresh = () => {};
        let tree = sd.shallowRender(<SingleCellIBox {...{isRefreshing, onRefresh}}/>);
        let selectedValue = tree.findComponentLike("IBoxControls", {...{isRefreshing}});
        expect(selectedValue.props).to.be.ok;
    });

});

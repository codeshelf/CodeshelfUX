import {expect} from "chai";
import sd from "skin-deep";
import OrderSearch from "../OrderSearch";
describe("OrderSearch", () => {
    it("Shows due date filter", () => {
        let tree = sd.shallowRender(<OrderSearch />);
    });

});

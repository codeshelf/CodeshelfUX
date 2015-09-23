import {expect} from "chai";
import sd from "skin-deep";
import OrdersIBox from "../OrdersIBox";
import State from "lib/state";


describe("OrdersIBox", () => {
    let appState = new State({pivot: {orders: {},
                                      selectedOrders: []}});


    it("Renders default", () => {
        let tree = sd.shallowRender(<OrdersIBox state={appState}/>);

    });

    it("Show progress", () => {
        let tree = sd.shallowRender(<OrdersIBox state={appState}/>);
        let instance = tree.getMountedInstance();
        instance.handleResultsUpdated([{notempty: true}], 100);
        instance.forceUpdate();
        let comp = tree.findComponentLike("SearchStatus", {});
        expect(comp.props.results.isEmpty()).to.be.false;

    });


    it("handleDrilldown", () => {
        let tree = sd.shallowRender(<OrdersIBox state={appState}/>);
        let instance = tree.getMountedInstance();
        instance.handleDrillDown([{notempty: true}]);
        instance.forceUpdate();
        let comp = tree.findComponentLike("OrderReview", {});
        expect(comp.props.orders.isEmpty()).to.be.false;
    });

});

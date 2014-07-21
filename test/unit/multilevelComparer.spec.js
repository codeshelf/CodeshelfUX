goog.provide("codeshelf.multilevelcomparer.spec");
goog.require("codeshelf.multilevelcomparer");
goog.require("goog.array");

describe("multilevel comparer", function() {
	var items;
	var itemA, itemB, itemA1, itemB1, itemA1a, itemA1b, itemB1a, itemB1b;
	var hierarchyMap;
	beforeEach(function() {
		 itemA = {
			"className": "L0",
			"persistentId": "A",
			"parentPersistentId": null
		};
		 itemA1 = {
			"className": "L1",
			"persistentId": "A1",
			"parentPersistentId": "A"
		};
		 itemA1a = {
			"className": "L2",
			"persistentId": "A1a",
			"parentPersistentId": "A1"
		};
		 itemA1b = {
			"className": "L2",
			"persistentId": "A1b",
			"parentPersistentId": "A1"
		};
		 itemB = {
			"className": "L0",
			"persistentId": "B",
			"parentPersistentId": null
		};
		 itemB1 = {
			"className": "L1",
			"persistentId": "B1",
			"parentPersistentId": "B"
		};
		 itemB1a = {
			"className": "L2",
			"persistentId": "B1a",
			"parentPersistentId": "B1"
		};
		 itemB1b = {
			"className": "L2",
			"persistentId": "B1b",
			"parentPersistentId": "B1"
		};

		hierarchyMap = [
			{"className": "L0", "linkProperty": "parent", "comparer": defaultComparer},
			{"className": "L1", "linkProperty": "parent", "comparer": defaultComparer},
			{"className": "L2", "linkProperty": "parent", "comparer": defaultComparer}
		];

	});

	it("compare in structure order",function() {

		items= [itemA, itemB, itemA1, itemB1, itemA1b, itemA1a, itemB1b,itemB1a];

		var sortedItems = [itemA, itemA1, itemA1a, itemA1b, itemB, itemB1, itemB1a, itemB1b];


		var comparer = new codeshelf.MultilevelComparer(hierarchyMap, items);
		items.sort(goog.bind(comparer.compare, comparer));
		var itemIds = mapIds(items);
		expect(itemIds).toEqual(mapIds(sortedItems));
	});


	it("sorts details under parent", function() {
		debugger;
		items = [itemA1, itemB1, itemB, itemA];
		var sortedItems = [itemA, itemA1, itemB, itemB1];

		var comparer = new codeshelf.MultilevelComparer(hierarchyMap, items);
		items.sort(goog.bind(comparer.compare, comparer));
		var itemIds = mapIds(items);
		expect(itemIds).toEqual(mapIds(sortedItems));

	});

	it("should sort this set of orders", function() {
		var orderItems =
[{"statusEnum":"CREATED","fullDomainId":"DEMO1.F1.6/13/14","parentPersistentId":"0e556810-091c-11e4-bc59-42b6f4f5cca3","op":"upd","description":"Order group - 6/13/14","persistentId":"73e58d20-0f0e-11e4-a4bd-7638415a28dd","active":true,"workSequence":null,"className":"OrderGroup","getLevel":0},{"op":"upd","parentPersistentId":"0e556810-091c-11e4-bc59-42b6f4f5cca3","orderTypeEnum":"OUTBOUND","readableOrderDate":"","readableDueDate":"","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry","orderGroupPersistentId":"73e58d20-0f0e-11e4-a4bd-7638415a28dd","customerId":null,"shipmentId":null,"description":"--- Order Header ---","persistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","active":true,"workSequence":null,"className":"OrderHeader","orderLocationAliasIds":"","containerId":"","orderId":"5397af47009132020000157d-dry"},{"op":"upd","parentPersistentId":"0e556810-091c-11e4-bc59-42b6f4f5cca3","orderTypeEnum":"OUTBOUND","readableOrderDate":"","readableDueDate":"","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000158-dry","orderGroupPersistentId":"73e58d20-0f0e-11e4-a4bd-7638415a28dd","customerId":null,"shipmentId":null,"description":"--- Order Header ---","persistentId":"741a31b0-0f0e-11e4-a4bd-7638415a28dd","active":true,"workSequence":null,"className":"OrderHeader","orderLocationAliasIds":"","containerId":"","orderId":"5397af47009132020000158-dry"},{"op":"upd","parentPersistentId":"0e556810-091c-11e4-bc59-42b6f4f5cca3","orderTypeEnum":"OUTBOUND","readableOrderDate":"","readableDueDate":"","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000159-dry","orderGroupPersistentId":"73e58d20-0f0e-11e4-a4bd-7638415a28dd","customerId":null,"shipmentId":null,"description":"--- Order Header ---","persistentId":"74311510-0f0e-11e4-a4bd-7638415a28dd","active":true,"workSequence":null,"className":"OrderHeader","orderLocationAliasIds":"","containerId":"","orderId":"5397af47009132020000159-dry"},{"orderDetailId":"5398ad2b5833490200000077","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry.5398ad2b5833490200000077","itemMasterId":"534492f24433dc0200000404","parentPersistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"box, nattycakes, Spring Chocolate Cupcakes","persistentId":"7416d650-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000157d-dry","uomMasterId":"box"},{"orderDetailId":"5398ad2b583349020000007b","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry.5398ad2b583349020000007b","itemMasterId":"5395dde859aab00200000d29","parentPersistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"jar, oaktownspiceshop, Cyprus White Flake Sea Salt","persistentId":"7411cd40-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000157d-dry","uomMasterId":"jar"},{"orderDetailId":"5398ad2b583349020000007a","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry.5398ad2b583349020000007a","itemMasterId":"5395e2bd59aab00200000dff","parentPersistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"jar, oaktownspiceshop, Pacific Fine Sea Salt","persistentId":"740d1250-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000157d-dry","uomMasterId":"jar"},{"orderDetailId":"5397af8406851f02000014ce","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry.5397af8406851f02000014ce","itemMasterId":"51881e305e33120200000118","parentPersistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"bag, primavera, Tortilla Chips","persistentId":"74079410-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":3,"className":"OrderDetail","orderId":"5397af47009132020000157d-dry","uomMasterId":"bag"},{"orderDetailId":"5397af8406851f02000014b4","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry.5397af8406851f02000014b4","itemMasterId":"52abbf730b2f17020000060d","parentPersistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"loaf, tartinebread, Porridge Bread","persistentId":"740263f0-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000157d-dry","uomMasterId":"loaf"},{"orderDetailId":"5397af8406851f02000014d2","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry.5397af8406851f02000014d2","itemMasterId":"51c8ffaa4d891b02000001c6","parentPersistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"1/2 dozen, sourflour, Assorted Bagels","persistentId":"73fc4970-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000157d-dry","uomMasterId":"1/2 dozen"},{"orderDetailId":"5397af8406851f02000014af","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry.5397af8406851f02000014af","itemMasterId":"5090448fd136890200000012","parentPersistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"jar, emmys, Pickle of the Month","persistentId":"73f74060-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":2,"className":"OrderDetail","orderId":"5397af47009132020000157d-dry","uomMasterId":"jar"},{"orderDetailId":"5397af8406851f02000014d0","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000157d-dry.5397af8406851f02000014d0","itemMasterId":"50930edff8025f0200000300","parentPersistentId":"73edf190-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"bag, nanajoesgranola, Gluten-Free Tony's Trail Mix","persistentId":"73f03b80-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000157d-dry","uomMasterId":"bag"},{"orderDetailId":"5397af8406851f02000013b4","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000158-dry.5397af8406851f02000013b4","itemMasterId":"52abbf730b2f17020000060d","parentPersistentId":"741a31b0-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"loaf, tartinebread, Porridge Bread","persistentId":"742bbde0-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000158-dry","uomMasterId":"loaf"},{"orderDetailId":"5397af8406851f02000013d2","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000158-dry.5397af8406851f02000013d2","itemMasterId":"51c8ffaa4d891b02000001c6","parentPersistentId":"741a31b0-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"1/2 dozen, sourflour, Assorted Bagels","persistentId":"742702f0-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":2,"className":"OrderDetail","orderId":"5397af47009132020000158-dry","uomMasterId":"1/2 dozen"},{"orderDetailId":"5397af8406851f02000013af","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000158-dry.5397af8406851f02000013af","itemMasterId":"5090448fd136890200000012","parentPersistentId":"741a31b0-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"jar, emmys, Pickle of the Month","persistentId":"7421d2d0-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000158-dry","uomMasterId":"jar"},{"orderDetailId":"5397af8406851f02000013d0","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000158-dry.5397af8406851f02000013d0","itemMasterId":"50930edff8025f0200000300","parentPersistentId":"741a31b0-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"bag, nanajoesgranola, Gluten-Free Tony's Trail Mix","persistentId":"741c7ba0-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":2,"className":"OrderDetail","orderId":"5397af47009132020000158-dry","uomMasterId":"bag"},{"orderDetailId":"5398ad2b5833490200003077","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000159-dry.5398ad2b5833490200003077","itemMasterId":"534492f24433dc0200000404","parentPersistentId":"74311510-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"box, nattycakes, Spring Chocolate Cupcakes","persistentId":"7444eb30-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":2,"className":"OrderDetail","orderId":"5397af47009132020000159-dry","uomMasterId":"box"},{"orderDetailId":"5398ad2b583349020000307b","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000159-dry.5398ad2b583349020000307b","itemMasterId":"5395dde859aab00200000d29","parentPersistentId":"74311510-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"jar, oaktownspiceshop, Cyprus White Flake Sea Salt","persistentId":"743fbb10-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":2,"className":"OrderDetail","orderId":"5397af47009132020000159-dry","uomMasterId":"jar"},{"orderDetailId":"5398ad2b583349020000307a","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000159-dry.5398ad2b583349020000307a","itemMasterId":"5395e2bd59aab00200000dff","parentPersistentId":"74311510-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"jar, oaktownspiceshop, Pacific Fine Sea Salt","persistentId":"7439c7a0-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000159-dry","uomMasterId":"jar"},{"orderDetailId":"5397af8406851f02000013ce","statusEnum":"CREATED","fullDomainId":"DEMO1.F1.5397af47009132020000159-dry.5397af8406851f02000013ce","itemMasterId":"51881e305e33120200000118","parentPersistentId":"74311510-0f0e-11e4-a4bd-7638415a28dd","op":"upd","description":"bag, primavera, Tortilla Chips","persistentId":"74329bb0-0f0e-11e4-a4bd-7638415a28dd","active":true,"quantity":1,"className":"OrderDetail","orderId":"5397af47009132020000159-dry","uomMasterId":"bag","getLevel":2}];

		var hierarchyMap = [
			{"className": "OrderGroup", "linkProperty": "parent", "comparer": defaultComparer},
			{"className": "OrderHeader", "linkProperty": "orderGroup", "comparer": workSequenceComparer},
			{"className": "OrderDetail", "linkProperty": "parent", "comparer": defaultComparer}
		];

		var comparer = new codeshelf.MultilevelComparer(hierarchyMap, orderItems);
		orderItems.sort(goog.bind(comparer.compare, comparer));
		var itemIds = mapIds(orderItems);

		//console.log(JSON.stringify(orderItems, undefined, 2));

		var sortedIds = ["73e58d20-0f0e-11e4-a4bd-7638415a28dd",
		 "73edf190-0f0e-11e4-a4bd-7638415a28dd",
		 "73f03b80-0f0e-11e4-a4bd-7638415a28dd",
		 "73f74060-0f0e-11e4-a4bd-7638415a28dd",
		 "73fc4970-0f0e-11e4-a4bd-7638415a28dd",
		 "740263f0-0f0e-11e4-a4bd-7638415a28dd",
		 "74079410-0f0e-11e4-a4bd-7638415a28dd",
		 "740d1250-0f0e-11e4-a4bd-7638415a28dd",
		 "7411cd40-0f0e-11e4-a4bd-7638415a28dd",
		 "7416d650-0f0e-11e4-a4bd-7638415a28dd",
		 "741a31b0-0f0e-11e4-a4bd-7638415a28dd",
		 "741c7ba0-0f0e-11e4-a4bd-7638415a28dd",
		 "7421d2d0-0f0e-11e4-a4bd-7638415a28dd",
		 "742702f0-0f0e-11e4-a4bd-7638415a28dd",
		 "742bbde0-0f0e-11e4-a4bd-7638415a28dd",
		 "74311510-0f0e-11e4-a4bd-7638415a28dd",
		 "74329bb0-0f0e-11e4-a4bd-7638415a28dd",
		 "7439c7a0-0f0e-11e4-a4bd-7638415a28dd",
		 "743fbb10-0f0e-11e4-a4bd-7638415a28dd",
		 "7444eb30-0f0e-11e4-a4bd-7638415a28dd"];

		 expect(itemIds).toEqual(sortedIds);

		});

	function mapIds(items) {
		return goog.array.map(items, function(item) {
			return item['persistentId'];
		});
	}

	function defaultComparer(itemA, itemB) {
		return itemA['persistentId'].localeCompare(itemB['persistentId']);
	}

	function workSequenceComparer(orderHeaderA, orderHeaderB) {
		if (orderHeaderA["workSequence"] < orderHeaderB["workSequence"]) {
			return -1;
		} else if (orderHeaderA["workSequence"] > orderHeaderB["workSequence"]) {
			return 1;
		} else {
			return dueDateComparer(orderHeaderA, orderHeaderB);
		}
	}

	function dueDateComparer(orderHeaderA, orderHeaderB) {
		var dateA = new Date(orderHeaderA['readableDueDate']);
		var dateB = new Date(orderHeaderB['readableDueDate']);
		if (dateA < dateB) {
			return -1;
		} else if (dateA > dateB) {
			return 1;
		} else {
			return orderIdComparer(orderHeaderA, orderHeaderB);
		}
	}

	function orderIdComparer(orderHeaderA, orderHeaderB) {
		if (orderHeaderA['orderId'] < orderHeaderB['orderId']) {
			return -1;
		} else if (orderHeaderA['orderId'] > orderHeaderB['orderId']) {
			return 1;
		} else {
			return goog.string.caseInsensitiveCompare(orderHeaderA['persistentId'], orderHeaderB['persistentId']);
		}
	}

});

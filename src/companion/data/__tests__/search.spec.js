import {expect} from "chai";
import sd from "skin-deep";
import Promise from "bluebird";
import search from "../search.js";

describe("on search", () => {
    it("empty references resolves empty", (done) => {
        const searchReferences = () => {return Promise.resolve([]);};
        const getReference = () => {throw new Error("should not get called");};
        const result = search(searchReferences, getReference);
            result.then((result) => {
            expect(result).to.eql([]);
            done();
        });
    });

    describe("when returns a reference", () => {
        const getReference = (key) => {
            return {[key]: key};
        };

        const testRefs = ["test1", "test2"];
        const testResults = testRefs.map(getReference);
        const searchReferences = () => {return Promise.resolve(testRefs);};

        it("references are resolved", (done) => {
            const promise = search(searchReferences, getReference);
            promise.then((result) => {
                expect(result).to.eql(testResults);
                done();
            });
        });

        it("call onProgress at end", (done) => {
            var called = false;
            const onProgress = (results, total) => {
                called = true;
                expect(total).to.equal(testRefs.length);
                expect(results).to.eql(testResults);
            };
            const promise = search(searchReferences, getReference, onProgress);
            promise.then(() => {
                expect(called).to.be.true;
                done();
            });

        });

    });


});

import { TestBed } from "@angular/core/testing";
import { generateNextId } from "./IdGeneration";

interface TestObject {
    id: string;
}

describe('IdGeneration', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(generateNextId).toBeTruthy();
    });

    [
        {
            arr: generateTestObjects('1', '2', '3'),
            expectedId: '4'
        },
        {
            arr: generateTestObjects('1', '2', '3', '4'),
            expectedId: '5'
        },
        {
            arr: generateTestObjects('1', '2', '4', '5'),
            expectedId: '6'
        },
        {
            arr: generateTestObjects('', '', '-1'),
            expectedId: '1'
        }
    ].forEach(params =>
        it('should generate a unique ID', () => {
            const id = generateNextId(params.arr);
            expect(id).toEqual(params.expectedId);
        }));

    function generateTestObjects(...ids: string[]): ReadonlyArray<TestObject> {
        return ids.map(id => ({ id }));
    }

});

import {KitchenLock} from "../domain/model/kitchen-lock.entity.js";

export class KitchenLockAssembler {
    static toEntityFromResource(resource) {
        return new KitchenLock({...resource})
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['kitchenLocks'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
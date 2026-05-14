import { CatalogItem } from "../domain/model/catalog-item.entity.js";

export class CatalogItemAssembler {
    static toEntityFromResource(resource) {
        return new CatalogItem({ ...resource });
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['catalog-items'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}

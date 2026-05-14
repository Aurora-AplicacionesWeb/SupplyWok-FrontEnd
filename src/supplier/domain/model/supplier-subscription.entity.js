export class SupplierSubscription {
    constructor({
                    id = null,
                    currentPlan = '',
                    summary = [],
                    plans = []
                } = {}) {
        this.id = id;
        this.currentPlan = currentPlan;
        this.summary = summary;
        this.plans = plans;
    }
}

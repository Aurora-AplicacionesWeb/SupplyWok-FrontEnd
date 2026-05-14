export class SupplierAlert {
    constructor({
                    id = null,
                    severity = '',
                    detail = '',
                    date = '',
                    status = '',
                    source = 'Client feed'
                } = {}) {
        this.id = id;
        this.severity = severity;
        this.detail = detail;
        this.date = date;
        this.status = status;
        this.source = source || 'Client feed';
    }
}

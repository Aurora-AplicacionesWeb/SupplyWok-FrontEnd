export class Dish {
    constructor({id= null, code='', name='', description='', price=0.0, categoryId=null, dishCategoryId=null,
                    categoryName='', dishCategoryName='', active=true, outstanding=true}) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId ?? dishCategoryId;
        this.categoryName = categoryName || dishCategoryName;
        this.active = active;
        this.outstanding = outstanding;
    }
}
this.list = this.list || {};

this.ckan.module('list', function ($, _) {
    function initialize() {
        this.view = new list.ListView({
            resource: JSON.parse(this.options.resource),
            resourceView: JSON.parse(this.options.resourceView)
        });
        $(this.el).append(this.view.el);
    }
    return {
        initialize: initialize,
        options: {
            resource: null,
            resourceView: null
        }
    };
});
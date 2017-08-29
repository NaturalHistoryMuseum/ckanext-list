this.list = this.list || {};
/**
 * NHMMap
 *
 * Custom backbone view to display the Windshaft based maps.
 */
(function(my, $) {

  var self;

  my.ListView = Backbone.View.extend({
    className: 'list-view',
    template: 'OH YES',

    /**
     * Initialize
     */
    initialize: function () {
      self = this;
      self.el = $(self.el);
      self.el.ready(this._onReady);
    },

    _onReady: function() {
      var resourceData = self.options.resource,
          resourceView = self.options.resourceView;

      self.loadView(resourceData, resourceView);
    },


    loadView: function (resourceData, resourceView) {
      var self = this;

      function showError(msg){
        msg = msg || _('error loading view');
        window.parent.ckan.pubsub.publish('data-viewer-error', msg);
      }

      resourceData.url  = this.normalizeUrl(resourceData.url);
      if (resourceData.formatNormalized === '') {
        var tmp = resourceData.url.split('/');
        tmp = tmp[tmp.length - 1];
        tmp = tmp.split('?'); // query strings
        tmp = tmp[0];
        var ext = tmp.split('.');
        if (ext.length > 1) {
          resourceData.formatNormalized = ext[ext.length-1];
        }
      }

      var errorMsg, dataset;

      resourceData.backend =  'ckan';
      resourceData.endpoint = jQuery('body').data('site-root') + 'api';

      resourceData.fields = ['barcode', 'basisOfRecord'];

      dataset = new recline.Model.Dataset(resourceData);

      var query = new recline.Model.Query();
      query.set({ size: resourceView.limit || 100 });
      query.set({ from: resourceView.offset || 0 });
      if (window.parent.ckan.views && window.parent.ckan.views.filters) {
        var defaultFilters = resourceView.filters || {},
            urlFilters = window.parent.ckan.views.filters.get(),
            filters = $.extend({}, defaultFilters, urlFilters);
        $.each(filters, function (field,values) {
          query.addFilter({type: 'term', field: field, term: values});
        });
        if (window.parent.ckan.views.filters.getFullText()){
          query.set({ q: window.parent.ckan.views.filters.getFullText()});
        }
      }
      dataset.queryState.set(query.toJSON(), {silent: true});
      // errorMsg = this.options.i18n.errorLoadingPreview + ': ' + this.options.i18n.errorDataStore;
      dataset.fetch()
        .done(function(dataset){
            self.initializeView(dataset, resourceView);
        })
        .fail(function(error){
          if (error.message) errorMsg += ' (' + error.message + ')';
          showError(errorMsg);
        });
    },

    normalizeUrl: function (url) {
      if (url.indexOf('https') === 0) {
        return 'http' + url.slice(5);
      } else {
        return url;
      }
    },


    initializeView: function (dataset, resourceView) {
      var view;
      if(typeof(dataset.recordCount) == 'undefined' || dataset.recordCount == 0){
        view = new NoRecordsView({
          'model': dataset,
          i18n: {noRecords:this.options.i18n.noRecords}
        });
      } else {
        var record;
        var records = dataset.records.models.map(function(data){
          record = {
            _id: data.attributes._id,
            attributes: []
          };
          // Add title
          if(resourceView.title_field){
            record['title'] = data.attributes[resourceView.title_field]
          }
          // Add image
          //  TODO: Parsing??
          if(resourceView.image_field){
            record['image'] = data.attributes[resourceView.image_field]
          }
          $.each(resourceView.fields, function (_, field) {
            if(data.attributes[field]){
              record.attributes.push({
                label: field,
                value: data.attributes[field]
              })
            }
          });
          return record;
        });
        var data = {
          records: records
        };
        $.get('/scripts/templates/list.mustache', function(template){
          var out = Mustache.render(template, data);
          self.el.html(out);
        });
      }
    }




  });
})(this.list, jQuery);

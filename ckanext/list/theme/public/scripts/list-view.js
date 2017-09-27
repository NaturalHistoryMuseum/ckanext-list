this.list = this.list || {};
/**
 * NHMMap
 *
 * Custom backbone view to display the Windshaft based maps.
 */
(function (my, $) {

    var self;

    my.ListView = Backbone.View.extend({
        className: 'list-view',

        /**
         * Initialize
         */
        initialize: function () {
            self = this;
            self.el = $(self.el);
            self.el.ready(this._onReady);
            // We regex to get field labels, which we'll speed up by caching
            self._fieldLabelCache = {}
        },

        _onReady: function () {
            var resourceData = self.options.resource,
                resourceView = self.options.resourceView;

            self.loadView(resourceData, resourceView);
        },


        loadView: function (resourceData, resourceView) {
            var self = this;

            resourceData.url = this.normalizeUrl(resourceData.url);
            if (resourceData.formatNormalized === '') {
                var tmp = resourceData.url.split('/');
                tmp = tmp[tmp.length - 1];
                tmp = tmp.split('?'); // query strings
                tmp = tmp[0];
                var ext = tmp.split('.');
                if (ext.length > 1) {
                    resourceData.formatNormalized = ext[ext.length - 1];
                }
            }

            var dataset;

            resourceData.backend = 'ckan';
            resourceData.endpoint = jQuery('body').data('site-root') + 'api';

            resourceData.fields = ['barcode', 'basisOfRecord'];

            dataset = new recline.Model.Dataset(resourceData);

            var query = new recline.Model.Query();
            query.set({size: resourceView.limit || 100});
            query.set({from: resourceView.offset || 0});
            if (window.parent.ckan.views && window.parent.ckan.views.filters) {
                var defaultFilters = resourceView.filters || {},
                    urlFilters = window.parent.ckan.views.filters.get(),
                    filters = $.extend({}, defaultFilters, urlFilters);
                $.each(filters, function (field, values) {
                    query.addFilter({type: 'term', field: field, term: values});
                });
                if (window.parent.ckan.views.filters.getFullText()) {
                    query.set({q: window.parent.ckan.views.filters.getFullText()});
                }
            }
            dataset.queryState.set(query.toJSON(), {silent: true});
            self.render(dataset, resourceView);
            // On query state change (user has changed page)
            this.listenTo(dataset.queryState, 'change', function () {
                self.render(dataset, resourceView);
            });
        },

        render: function (dataset, resourceView) {
            var errorMsg = this.options.i18n.errorLoadingPreview + ': ' + this.options.i18n.errorDataStore;
            dataset.fetch()
                .done(function (dataset) {
                    self.initializeView(dataset, resourceView);
                })
                .fail(function (error) {
                    if (error.message) errorMsg += ' (' + error.message + ')';
                    self.showError(errorMsg);
                });
        },

        showError: function (msg) {
            msg = msg || _('error loading view');
            window.parent.ckan.pubsub.publish('data-viewer-error', msg);
        },

        normalizeUrl: function (url) {
            if (url.indexOf('https') === 0) {
                return 'http' + url.slice(5);
            } else {
                return url;
            }
        },

        initializeView: function (dataset, resourceView) {
            var controls = [
                new recline.View.Pager({model: dataset}),
                new recline.View.RecordCount({model: dataset})
            ];
            if (typeof(dataset.recordCount) == 'undefined' || dataset.recordCount == 0) {
                self.el.html('<p class="recline-norecords">No matching records</p>');
            } else {
                var record;
                var records = dataset.records.models.map(function (data) {
                    record = {
                        _id: data.attributes._id,
                        attributes: []
                    };
                    // Add title
                    if (resourceView.title_field) {
                        record.title = data.attributes[resourceView.title_field];
                        if (!record.title && resourceView.secondary_title_field) {
                            record.title = data.attributes[resourceView.secondary_title_field];
                        }
                    }
                    // Add image
                    if (resourceView.image_field) {
                        var img = data.attributes[resourceView.image_field];
                        if ($.type(img) !== "undefined" && img) {
                            record.image = JSON.parse(img)[0];
                            // Yuck!! Hack for NHM MAM images.
                            // FIXME: Mustache template per dataset resource
                            if(record.image.identifier.indexOf('www.nhm.ac.uk/services')!== -1){
                                record.image.identifier = record.image.identifier.replace('preview', 'thumbnail')
                            }
                        }
                    }
                    $.each(resourceView.fields, function (_, fieldName) {
                        if (data.attributes[fieldName]) {
                            record.attributes.push({
                                label: self.fieldNameToLabel(fieldName),
                                value: data.attributes[fieldName]
                            })
                        }
                    });
                    return record;
                });
                var data = {
                    records: records,
                    resourceView: resourceView
                };

                $.get('/scripts/templates/list.mustache', function (template) {
                    var newElements = $('<div />');
                    self._renderControls(newElements, controls);
                    newElements.append(Mustache.render(template, data));
                    self.el.html(newElements);
                });
            }
        },

        _renderControls: function (el, controls) {
          var controlsEl = $("<div class=\"clearfix controls\" />");
          for (var i = 0; i < controls.length; i++) {
            controlsEl.append(controls[i].el);
          }
          $(el).append(controlsEl);
        },

        fieldNameToLabel: function (fieldName) {
            // If the field label does exists in the cache, create it
            if (!(fieldName in self._fieldLabelCache)) {
                var fieldLabel;
                // If fieldName is all in caps, treat it as an acronym; do not format
                if (fieldName.replace(/[A-Z]/g, '').length == 0) {
                    fieldLabel = fieldName;
                } else {
                    // Otherwise, split field on capital letters...
                    fieldLabel = fieldName.replace(/([A-Z])/g, ' $1');
                    // ... and capitalise the first letter
                    fieldLabel = fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1);
                }
                // Cache the label
                self._fieldLabelCache[fieldName] = fieldLabel

            }
            return self._fieldLabelCache[fieldName];
        }

    });
})(this.list, jQuery);

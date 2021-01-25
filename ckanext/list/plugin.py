#!/usr/bin/env python
# encoding: utf-8
#
# This file is part of ckanext-list
# Created by the Natural History Museum in London, UK

import json
from logging import getLogger

from ckan.plugins import SingletonPlugin, implements, interfaces, toolkit
from ckanext.list.lib import get_datastore_fields
from ckanext.list.logic.validators import is_datastore_field

log = getLogger(__name__)
ignore_empty = toolkit.get_validator(u'ignore_empty')


class ListPlugin(SingletonPlugin):
    '''
    Summary dataset view.
    Provides a summary view of records, to replace the grid.
    '''
    implements(interfaces.IConfigurer, inherit=True)
    implements(interfaces.IResourceView, inherit=True)

    ## IConfigurer
    def update_config(self, config):
        '''
        Add our template directories to the list of available templates.

        :param config:
        '''
        toolkit.add_template_directory(config, u'theme/templates')
        toolkit.add_public_directory(config, u'theme/public')
        toolkit.add_resource(u'theme/assets', u'ckanext-list')

    def view_template(self, context, data_dict):
        '''
        :param context:
        :param data_dict:
        '''
        return u'list/list_view.html'

    def form_template(self, context, data_dict):
        '''
        :param context:
        :param data_dict:
        '''
        return u'list/list_form.html'

    def can_view(self, data_dict):
        '''
        Specify which resources can be viewed by this plugin.

        :param data_dict: return: boolean
        :returns: boolean
        '''
        # Check that we have a datastore for this resource
        if data_dict[u'resource'].get(u'datastore_active', False):
            return True
        return False

    ## IResourceView
    def info(self):
        ''' '''
        return {
            u'name': u'list',
            u'title': u'List',
            u'schema': {
                u'title_field': [is_datastore_field],
                u'secondary_title_field': [ignore_empty, is_datastore_field],
                u'fields': [ignore_empty, is_datastore_field],
                u'image_field': [ignore_empty, is_datastore_field],
            },
            u'icon': u'list-alt',
            u'iframed': True,
            u'filterable': True,
            u'preview_enabled': True,
            u'full_page_edit': False
        }

    def setup_template_variables(self, context, data_dict):
        '''
        Setup variables available to templates.

        :param context:
        :param data_dict:
        '''
        datastore_fields = get_datastore_fields(data_dict[u'resource'][u'id'], context)
        return {
            u'resource_json': json.dumps(data_dict[u'resource']),
            u'resource_view_json': json.dumps(data_dict[u'resource_view']),
            # Fields - used in the form display options
            u'fields': [{
                u'text': f,
                u'value': f
            } for f in datastore_fields],
        }

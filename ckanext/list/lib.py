#!/usr/bin/env python
# encoding: utf-8
"""
Created by Ben Scott on '24/08/2017'.
"""

import ckan.plugins.toolkit as toolkit


def get_datastore_fields(resource_id, context):
    data = {'resource_id': resource_id, 'limit': 0}
    fields = toolkit.get_action('datastore_search')(context, data)['fields']
    return sorted([f['id'] for f in fields])

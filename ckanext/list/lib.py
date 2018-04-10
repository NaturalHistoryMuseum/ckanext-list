# !/usr/bin/env python
# encoding: utf-8
#
# This file is part of ckanext-list
# Created by the Natural History Museum in London, UK

from ckan.plugins import toolkit


def get_datastore_fields(resource_id, context):
    '''

    :param resource_id: 
    :param context: 

    '''
    data = {
        u'resource_id': resource_id,
        u'limit': 0
        }
    fields = toolkit.get_action(u'datastore_search')(context, data)[u'fields']
    return sorted([f[u'id'] for f in fields])

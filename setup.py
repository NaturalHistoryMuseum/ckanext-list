#!/usr/bin/env python
# encoding: utf-8
#
# This file is part of ckanext-list
# Created by the Natural History Museum in London, UK

from setuptools import setup, find_packages

version = u'0.1'

setup(
    name=u'ckanext-list',
    version=version,
    description=u'Summary list view for datastore records.',
    long_description=u'',
    classifiers=[],  # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
    keywords=u'',
    author=u'Ben Scott',
    author_email=u'ben@benscott.co.uk',
    url=u'',
    license=u'',
    packages=find_packages(exclude=[u'ez_setup', u'list', u'tests']),
    namespace_packages=[u'ckanext', u'ckanext.list'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[],
    entry_points= \
        u'''
            [ckan.plugins]
            list=ckanext.list.plugin:ListPlugin
        ''',
)

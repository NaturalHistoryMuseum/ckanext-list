from setuptools import setup, find_packages

version = '0.1'

setup(
    name='ckanext-list',
    version=version,
    description='Summary list view for datastore records.',
    long_description='',
    classifiers=[],  # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
    keywords='',
    author='Ben Scott',
    author_email='ben@benscott.co.uk',
    url='',
    license='',
    packages=find_packages(exclude=['ez_setup', 'list', 'tests']),
    namespace_packages=['ckanext', 'ckanext.list'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[],
    entry_points= \
        """
            [ckan.plugins]
            list=ckanext.list.plugin:ListPlugin
        """,
)

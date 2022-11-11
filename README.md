<img src=".github/nhm-logo.svg" align="left" width="150px" height="100px" hspace="40"/>

# ckanext-list

[![Tests](https://img.shields.io/github/workflow/status/NaturalHistoryMuseum/ckanext-list/Tests?style=flat-square)](https://github.com/NaturalHistoryMuseum/ckanext-list/actions/workflows/main.yml)
[![Coveralls](https://img.shields.io/coveralls/github/NaturalHistoryMuseum/ckanext-list/main?style=flat-square)](https://coveralls.io/github/NaturalHistoryMuseum/ckanext-list)
[![CKAN](https://img.shields.io/badge/ckan-2.9.1-orange.svg?style=flat-square)](https://github.com/ckan/ckan)
[![Python](https://img.shields.io/badge/python-3.6%20%7C%203.7%20%7C%203.8-blue.svg?style=flat-square)](https://www.python.org/)
[![Docs](https://img.shields.io/readthedocs/ckanext-list?style=flat-square)](https://ckanext-list.readthedocs.io)

_A CKAN extension that adds a list view for resources._


# Overview

This extension adds a list view for resources on a CKAN instance. Records are listed as brief summaries, with a configurable set of fields shown for each.

**NB**: This extension currently only works with the Natural History Museum's theme extension [ckanext-nhm](https://github.com/NaturalHistoryMuseum/ckanext-nhm); this [should be fixed](https://github.com/NaturalHistoryMuseum/ckanext-list/issues/9) in future releases (contributions are always welcome).


# Installation

Path variables used below:
- `$INSTALL_FOLDER` (i.e. where CKAN is installed), e.g. `/usr/lib/ckan/default`
- `$CONFIG_FILE`, e.g. `/etc/ckan/default/development.ini`

1. Clone the repository into the `src` folder:

  ```bash
  cd $INSTALL_FOLDER/src
  git clone https://github.com/NaturalHistoryMuseum/ckanext-list.git
  ```

2. Activate the virtual env:

  ```bash
  . $INSTALL_FOLDER/bin/activate
  ```

3. Install the requirements from requirements.txt:

  ```bash
  cd $INSTALL_FOLDER/src/ckanext-list
  pip install -r requirements.txt
  ```

4. Run setup.py:

  ```bash
  cd $INSTALL_FOLDER/src/ckanext-list
  python setup.py develop
  ```

5. Add 'list' to the list of plugins in your `$CONFIG_FILE`:

  ```ini
  ckan.plugins = ... list
  ```

# Configuration

There are currently no options that can be specified in your .ini config file.


# Usage

To use the view in a template:

```html+jinja
<div data-module="list"
     data-module-resource = "{{ h.dump_json(resource_json) }}"
     data-module-resource-view = "{{ h.dump_json(resource_view_json) }}">
</div>

{% resource 'ckanext-list/main' %}
```


# Testing

There is a Docker compose configuration available in this repository to make it easier to run tests.

To run the tests against ckan 2.9.x on Python3:

1. Build the required images
```bash
docker-compose build
```

2. Then run the tests.
   The root of the repository is mounted into the ckan container as a volume by the Docker compose
   configuration, so you should only need to rebuild the ckan image if you change the extension's
   dependencies.
```bash
docker-compose run ckan
```

The ckan image uses the Dockerfile in the `docker/` folder.

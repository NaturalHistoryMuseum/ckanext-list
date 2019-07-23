<img src=".github/nhm-logo.svg" align="left" width="150px" height="100px" hspace="40"/>

# ckanext-list

[![Travis](https://img.shields.io/travis/NaturalHistoryMuseum/ckanext-list/master.svg?style=flat-square)](https://travis-ci.org/NaturalHistoryMuseum/ckanext-list)
[![Coveralls](https://img.shields.io/coveralls/github/NaturalHistoryMuseum/ckanext-list/master.svg?style=flat-square)](https://coveralls.io/github/NaturalHistoryMuseum/ckanext-list)
[![CKAN](https://img.shields.io/badge/ckan-2.9.0a-orange.svg?style=flat-square)](https://github.com/ckan/ckan)

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

_Test coverage is currently extremely limited._

To run the tests, use nosetests inside your virtualenv. The `--nocapture` flag will allow you to see the debug statements.
```bash
nosetests --ckan --with-pylons=$TEST_CONFIG_FILE --where=$INSTALL_FOLDER/src/ckanext-list --nologcapture --nocapture
```

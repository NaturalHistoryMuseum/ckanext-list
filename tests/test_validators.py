import pytest
from ckan.plugins import toolkit
from mock import patch, MagicMock

from ckanext.list.logic.validators import is_datastore_field


@pytest.mark.usefixtures(u'with_request_context')
def test_is_datastore_field_valid():
    toolkit.c.resource = {u'id': MagicMock()}
    fields = [u'field1', u'field2']
    get_datastore_fields_mock = MagicMock(return_value=fields)
    with patch(u'ckanext.list.logic.validators.get_datastore_fields', get_datastore_fields_mock):
        assert is_datastore_field(u'field1', MagicMock()) == u'field1'
        assert is_datastore_field(u'field2', MagicMock()) == u'field2'


@pytest.mark.usefixtures(u'with_request_context')
def test_is_datastore_field_invalid():
    toolkit.c.resource = {u'id': MagicMock()}
    fields = [u'field1', u'field2']
    get_datastore_fields_mock = MagicMock(return_value=fields)
    with patch(u'ckanext.list.logic.validators.get_datastore_fields', get_datastore_fields_mock):
        with pytest.raises(toolkit.Invalid, match=u'Field not found in datastore'):
            is_datastore_field(u'field3', MagicMock())


@pytest.mark.usefixtures(u'with_request_context')
def test_is_datastore_field_valid_multiple():
    toolkit.c.resource = {u'id': MagicMock()}
    fields = [u'field1', u'field2']
    get_datastore_fields_mock = MagicMock(return_value=fields)
    with patch(u'ckanext.list.logic.validators.get_datastore_fields', get_datastore_fields_mock):
        # both valid
        assert is_datastore_field(fields, MagicMock()) == fields


@pytest.mark.usefixtures(u'with_request_context')
def test_is_datastore_field_invalid_multiple():
    toolkit.c.resource = {u'id': MagicMock()}
    fields = [u'field1', u'field2']
    get_datastore_fields_mock = MagicMock(return_value=fields)
    with patch(u'ckanext.list.logic.validators.get_datastore_fields', get_datastore_fields_mock):
        with pytest.raises(toolkit.Invalid, match=u'Field not found in datastore'):
            # first one is valid, second one isn't
            assert is_datastore_field([u'field2', u'field3'], MagicMock()) == fields

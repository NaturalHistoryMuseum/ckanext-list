from mock import MagicMock, patch

from ckanext.list.lib import get_datastore_fields


def test_get_datastore_fields():
    result = {
        u'fields': [
            {
                u'id': u'beans'
            },
            {
                u'id': u'lemons'
            },
            {
                u'id': u'goats'
            },
        ]
    }
    mock_toolkit = MagicMock(get_action=MagicMock(return_value=MagicMock(return_value=result)))

    with patch(u'ckanext.list.lib.toolkit', mock_toolkit):
        assert get_datastore_fields(MagicMock(), MagicMock()) == [u'beans', u'goats', u'lemons']


def test_get_datastore_fields_empty():
    result = {
        u'fields': []
    }
    mock_toolkit = MagicMock(get_action=MagicMock(return_value=MagicMock(return_value=result)))

    with patch(u'ckanext.list.lib.toolkit', mock_toolkit):
        assert get_datastore_fields(MagicMock(), MagicMock()) == []


def test_get_datastore_fields_missing():
    result = {}
    mock_toolkit = MagicMock(get_action=MagicMock(return_value=MagicMock(return_value=result)))

    with patch(u'ckanext.list.lib.toolkit', mock_toolkit):
        assert get_datastore_fields(MagicMock(), MagicMock()) == []

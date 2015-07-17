__author__ = 'Farbod'

class UrlManager(object):

    EVENT_SEARCH = "https://www.eventbriteapi.com/v3/events/search/"
    CATEGORIES = "https://www.eventbriteapi.com/v3/categories/"
    VENUE = "https://www.eventbriteapi.com/v3/venues/"

    def __init__(self, token):
        self.token = token

    def create_url(self, endpoint=EVENT_SEARCH, parameters=dict()):
        url = endpoint + "?token=" + self.token
        for parameter_key in parameters:
            url += "&" + parameter_key + "=" + parameters[parameter_key]
        return url
__author__ = 'Farbod'


class Event(object):

    def __init__(self):
        self.events = []

    def add_event(self, event, venue, category):
        self.events.append({"event_name": event[0], "category_id": event[1], "category_name": category[0][1],
                            "venue_id": event[2], "venue": venue[1], "latitude": venue[2], "longitude": venue[3]})
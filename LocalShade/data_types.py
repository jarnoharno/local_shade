__author__ = 'Farbod'


class Event(object):

    def __init__(self):
        self.events = []

    def add_event(self, event, venue, category):
        self.events.append({"event_name": event[0], "category_id": event[1], "category_name": category[0][1],
                            "venue_id": event[2], "venue": venue[1], "latitude": venue[2], "longitude": venue[3]})

    def get_categories(self):
        return [event["category_name"] for event in self.events]

    def get_train_list(self, training_labels):
        result = []
        for event in self.events:
            if event["category_name"] in training_labels:
                result.append([float(event["latitude"]), float(event["longitude"])])
        return result

    def get_target_list(self, training_labels):
        result = []
        for event in self.events:
            if event["category_name"] in training_labels:
                result.append(event["category_name"])
        return result

    def get_test_list(self, test_labels):
        result = []
        for event in self.events:
            if event["category_name"] in test_labels:
                result.append([float(event["latitude"]), float(event["longitude"])])
        return result
__author__ = 'Farbod'


class Event(object):

    def __init__(self):
        self.events = []

    def add_event(self, event, venue, category):
        vids = set([e["venue_id"] for e in self.events][:])
        if event[2] not in vids:
            self.events.append({"event_name": event[0], "category_id": event[1], "category_name": category[0][1],
                                "venue_id": event[2], "venue": venue[1], "latitude": venue[2], "longitude": venue[3]})

    def get_categories(self):
        return [event["category_name"] for event in self.events]

    # This is not working and not used
    def get_distinct_data_point(self):
        data_points = list()
        for event in self.events:
            temp = (event["category_name"], event["latitude"], event["longitude"])
            if temp in data_points:
                continue
            else:
                None
            data_points.append()
        data_points = [(event["category_name"], event["latitude"], event["longitude"]) for event in self.events]
        data_points = set(data_points)


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

    @staticmethod
    def get_category_color(category_name):
        colors = {"Music": "#02B1E1", "Business & Professional": "#DE0F30", "Food & Drink": "#738847",
         "Community & Culture": "#F8E83A", "Performing & Visual Arts": "#D0BEFB",
         "Film, Media & Entertainment": "#4E2F83", "Sports & Fitness": "#AC3634", "Health & Wellness": "#D0C59D",
         "Science & Technology": "#393B4E", "Travel & Outdoor": "#3D7A5F", "Charity & Causes": "#7D166E",
         "Religion & Spirituality": "#974522", "Family & Education": "#DEC1C8", "Seasonal & Holiday": "#BF0A4E",
         "Government & Politics": "#FF591D", "Fashion & Beauty": "#F04B83", "Home & Lifestyle": "#1AF206",
         "Auto, Boat & Air": "#020540", "Hobbies & Special Interest": "#F8CD75", "Other": "#FB3214"}
        return colors[category_name]
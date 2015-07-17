__author__ = "Farbod"

from data_manager import DataManager
from url_manager import UrlManager
from data_types import Event
from collections import Counter
import numpy as np
import pylab as pl
from sklearn import neighbors
import sys


class Main(object):

    def __init__(self, top_right, bottom_left):
        self.event_instance = None
        self.token = Main.get_token()
        self.data_manager = DataManager(self.token)
        self.top_right = top_right
        self.bottom_left = bottom_left
        # Only uncomment the following lines if you want to get the data for the first time
        #self.data_manager.reset_events_table()
        #self.data_manager.get_and_insert_events_into_database({"venue.city": "Berlin"})
        #self.data_manager.get_and_insert_venues_into_database()
        #self.data_manager.reset_venues_table()
        #self.data_manager.get_and_insert_venues_into_database()
        #self.data_manager.insert_events_from_file()
        #self.data_manager.get_and_insert_categories_into_database()
        self.run()
        self.data_manager.close_con()

    def run(self):
        self.event_instance = self.data_manager.get_events_for_view(self.top_right, self.bottom_left)
        train_and_test = self.divide_events_into_train_test()
        training_data_array = np.array(self.event_instance.get_train_list(train_and_test["training_labels"]))
        training_target_array = np.array(self.event_instance.get_target_list(train_and_test["training_labels"]))
        testing_array = np.array(self.event_instance.get_test_list(train_and_test["testing_labels"]))
        knn = neighbors.KNeighborsClassifier()
        knn.fit(training_data_array, training_target_array)
        testing_target = knn.predict(testing_array)
        data_points = np.concatenate((training_data_array, testing_array))
        targets = np.concatenate((training_target_array, testing_target))
        df = file("datapoints.csv", "w")
        for i in range(len(data_points)):
            df.write(str(data_points[i][0])+","+str(data_points[i][1])+"\n")
        df.close()
        tf = file("targets.csv", "w")
        for i in range(len(targets)):
            tf.write(targets[i]+"\n")
        tf.close()
        print data_points
        print targets

    def divide_events_into_train_test(self):
        frequencies = Counter(self.event_instance.get_categories())
        total = sum(frequencies.values())
        for key in frequencies:
            frequencies[key] /= float(total)

        values = sorted(frequencies.values(), reverse=True)
        if len(values) > 3:
            values = values[0:4]
            train_labels = [k for (k, v) in frequencies.items() if frequencies[k] in values and frequencies[k] > .1]
            other_labels = [k for (k, v) in frequencies.items() if k not in train_labels]
        else:
            train_labels = [k for (k, v) in frequencies.items() if frequencies[k] > .1]
            other_labels = [k for (k, v) in frequencies.items() if k not in train_labels]
        return {"training_labels": train_labels, "testing_labels": other_labels}


    @staticmethod
    def get_token():
        file_path = "../../token.txt"
        while True:
            try:
                file_handle = open(file_path, "r")
                token = file_handle.read().strip()
                return token
            except IOError, e:
                print "IOError occurred, here follows the error message: "
                print e
                file_path = raw_input("It seems that the required file couldn't be found, please enter the path if "
                                      "you know it or enter \".\" to quit: ")
            if file_path == ".":
                sys.exit(1)

"""
    def run(self):
        parameters = {"venue.city": "Helsinki"}
        categories_response = self.data_manager.extract_info(UrlManager.CATEGORIES)
        categories = dict()
        for category in categories_response["categories"]:
            categories[category["id"]] = category["name"]
        events_response = self.data_manager.extract_info(UrlManager.EVENT_SEARCH, parameters)
        for event in events_response["events"]:
            if event["category_id"] is not None:
                print categories[event["category_id"]]
            else:
                print "Unknown"
"""


bottom_left = {"latitude": 52.487592, "longitude": 13.316753}
top_right = {"latitude": 52.557480, "longitude": 13.482072}
Main(top_right, bottom_left)
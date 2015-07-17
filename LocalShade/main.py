__author__ = "Farbod"

from data_manager import DataManager
from url_manager import UrlManager
from data_types import Event
import sys


class Main(object):

    def __init__(self):

        self.token = Main.get_token()
        self.data_manager = DataManager(self.token)

        # Only uncomment the following lines if you want to get the data for the first time
        #self.data_manager.reset_events_table()
        #self.data_manager.get_and_insert_events_into_database({"venue.city": "Berlin"})
        #self.data_manager.get_and_insert_venues_into_database()
        #self.data_manager.reset_venues_table()
        #self.data_manager.get_and_insert_venues_into_database()
        #self.data_manager.insert_events_from_file()
        #self.data_manager.get_and_insert_categories_into_database()
        #self.run()
        print self.data_manager.get_events_for_view(52.487592, 13.316753, 52.557480, 13.482072).events
        self.data_manager.close_con()

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

    @staticmethod
    def get_token():
        file_path = "../token.txt"
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

Main()
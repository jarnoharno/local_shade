__author__ = 'Farbod'

import sys


class EventbriteApiManager(object):

    def __init__(self):
        self.token = EventbriteApiManager.get_token()
        # Only uncomment the following lines if you want to get the data for the first time
        #self.data_manager.reset_events_table()
        #self.data_manager.get_and_insert_events_into_database(self.token, {"venue.city": "Berlin"})
        #self.data_manager.reset_venues_table()
        #self.data_manager.get_and_insert_venues_into_database(self.token)
        #self.data_manager.insert_events_from_file()
        #self.data_manager.get_and_insert_categories_into_database(self.token)

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

__author__ = "Farbod"

import sqlite3 as lite
import requests
import sys
from data_types import Event
from url_manager import UrlManager


class DataManager(object):

    def __init__(self, token):
        self.token = token
        self.con = None
        self.cur = None
        self.create_database_connector()

    def extract_info(self, endpoint, parameters=dict()):
        response = requests.get(
            UrlManager(self.token).create_url(endpoint, parameters),
            headers={
            "Authorization": "Bearer " + self.token,
            },
            verify=True,  # Verify SSL certificate
        )
        return response.json()

    def create_database_connector(self):
        try:
            self.con = lite.connect('localshade.db')
            self.cur = self.con.cursor()

        except lite.Error, e:
            print "Error %s:" % e.args[0]
            sys.exit(1)

    def reset_venues_table(self):
        self.cur.execute("DROP TABLE IF EXISTS Venues")
        self.cur.execute("CREATE TABLE IF NOT EXISTS Venues(VenueId Int, VenueName Text, VenueLatitude Text,"
                             "VenueLongitude Text)")

    def reset_events_table(self):
        self.cur.execute("DROP TABLE IF EXISTS Events")
        self.cur.execute("CREATE TABLE IF NOT EXISTS Events(EventName Text, CategoryId Int, VenueId Int)")

    def get_and_insert_events_into_database(self, parameters={}):
        parameters["page"] = "1"
        response = self.extract_info(UrlManager.EVENT_SEARCH, parameters)
        for i in range(2, response["pagination"]["page_count"]):
            print "page number: %d total: %d" % (response["pagination"]["page_number"], response["pagination"]["page_count"])
            for event in response["events"]:
                if event["name"]["text"] is None or event["category_id"] is None or event["venue_id"] is None:
                    continue
                self.cur.execute("INSERT INTO Events VALUES(?, ?, ?)", (event["name"]["text"],
                                                                        int(event["category_id"]),
                                                                        int(event["venue_id"])))
            self.con.commit()
            parameters["page"] = str(i)
            response = self.extract_info(UrlManager.EVENT_SEARCH, parameters)

    def get_and_insert_categories_into_database(self):
        self.cur.execute("DROP TABLE IF EXISTS Categories")
        self.cur.execute("CREATE TABLE IF NOT EXISTS Categories(CategoryId Int, CategoryName Text)")
        categories = self.extract_info(UrlManager.CATEGORIES, {})
        for category in categories["categories"]:
            self.cur.execute("INSERT INTO Categories VALUES(?, ?)", (int(category["id"]), category["name"]))
        self.con.commit()

    def insert_events_from_file(self):
        file_h = open("file.csv", "r")
        for line in file_h.readlines():
            elements = line.strip().split(",")
            self.cur.execute("INSERT INTO Events VALUES(?, ?, ?)", (elements[0][1:-1], elements[1],
                                                                    elements[2]))

    def get_events_for_view(self, bottom_x, bottom_y, top_x, top_y):
        self.cur.execute("SELECT * FROM Venues WHERE VenueLatitude < ? AND VenueLongitude < ? AND VenueLatitude > ? "
                         "AND VenueLongitude > ?", (top_x, top_y, bottom_x, bottom_y))
        venues_in_sight = self.cur.fetchall()
        events_instance = Event()
        for venue in venues_in_sight:
            self.cur.execute("SELECT * FROM Events WHERE VenueId = ?", (venue[0],))
            events = self.cur.fetchall()
            for event in events:
                self.cur.execute("SELECT * FROM Categories WHERE CategoryId = ?", (event[1],))
                category = self.cur.fetchall()
                events_instance.add_event(event, venue, category)
        return events_instance


    def get_and_insert_venues_into_database(self):
        self.cur.execute("SELECT DISTINCT VenueId FROM Events")
        venue_ids = self.cur.fetchall()
        self.cur.execute("SELECT DISTINCT VenueId FROM Venues")
        venue_ids_extracted = self.cur.fetchall()
        venue_ids_extracted = [id[0] for id in venue_ids_extracted]
        i = 1
        total = len(venue_ids)
        for id in venue_ids:
            if id[0] in venue_ids_extracted:
                continue
            response = self.extract_info(UrlManager.VENUE + str(id[0]) + "/")
            self.cur.execute("INSERT INTO Venues VALUES(?, ?, ?, ?)", (int(response["id"]), response["name"],
                                                                       response["latitude"], response["longitude"]))
            self.con.commit()
            print "i: %d total: %d" % (i, total)
            i += 1

    def close_con(self):
        self.con.close()
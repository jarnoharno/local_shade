__author__ = "Farbod"

from data_manager import DataManager
from collections import Counter
from data_types import Event
import numpy as np
from sklearn import neighbors
import sys
import json


class Main(object):

    def __init__(self, top_right, bottom_left):
        self.event_instance = None
        self.data_manager = DataManager()
        self.top_right = top_right
        self.bottom_left = bottom_left
        self.result = self.run()
        self.data_manager.close_con()

    def get_result(self):
        return self.result

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
        targets_map = list()
        target_index = 0
        for target in np.unique(targets):
            targets_map.append((target, target_index, Event.get_category_color(target)))
            target_index += 1
        result = []
        result.append([[t, c] for (t, i, c) in targets_map])
        dp = list()
        #df = file("datapoints.csv", "w")

        for i in range(len(data_points)):
        #    df.write(str(data_points[i][0])+","+str(data_points[i][1])+","+str(targets_map[targets[i]][0])+"\n")
            index = [index for (t, index, c) in targets_map if t == targets[i]]
            dp.append([data_points[i][0], data_points[i][1], index[0]])
        result.append(dp)
        return result
        #df.close()
        #tf = file("targets.csv", "w")
        #for i in range(len(targets)):
        #    tf.write(str(targets_map[targets[i]])+","+targets[i]+"\n")
        #tf.close()

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


def run(bottom_left={"latitude": 52.487592, "longitude": 13.316753},
        top_right={"latitude": 52.557480, "longitude": 13.482072}):
    main = Main(top_right, bottom_left)
    return main.get_result()

if __name__ == "__main__":
    args = sys.argv
    if len(args) < 2:
        result = run()
    else:
        result = run({"latitude": args[1], "longitude": args[2]}, {"latitude": args[3], "longitude": args[4]})
    print "parseData(",
    print json.dumps(result[0], sort_keys=True, indent=2),
    print ",",
    print json.dumps(result[1], sort_keys=True, indent=2),
    print ");"
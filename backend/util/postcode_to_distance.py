import geopy.distance
import pandas as pd

df = pd.read_csv('./data/postcode.csv')


def distance(p1, p2):
    return geopy.distance.geodesic(p1, p2).km


# get distance between two postcode
def distance_post(post1, post2):
    p1 = df.loc[df['postcode'] == post1].values[0, 1:]
    p2 = df.loc[df['postcode'] == post2].values[0, 1:]
    return geopy.distance.geodesic(p1, p2).km

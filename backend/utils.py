from backend import models
from typing import Any
from datetime import date
from backend import schemas
from datetime import datetime
from itertools import groupby
from typeguard import typechecked
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(
    key_func= get_remote_address,
    strategy="fixed-window",
    storage_uri="memory://",
)

def month_stats_activities(
    range_activities: dict[Any | None, list[date | None]],
    activities: list[models.Activities],
    configure: str
) -> schemas.Stats_activities:
    
    stats = schemas.Stats_activities()

    if configure == "month":
        iterator = range(1, 13)
    elif configure == "week":
        iterator = range(1, 53)
    else:
        raise ValueError("You have to select month/week")
    
    stats.activities_per_range = dict.fromkeys(iterator, 0)
    stats.avg_reps_per_range = dict.fromkeys(iterator, 0)
    stats.avg_weight_per_range =dict.fromkeys(iterator, 0)
    
    for data in range_activities:
        for _range, dates in data.items():
            counter_reps = 0
            counter_weight = 0

            for date in dates:
                for activity in activities:
                    if activity.date == date:
                        stats.total_activities += 1
                        stats.activities_per_range[_range] += 1
                        counter_reps += activity.exercise_reps
                        counter_weight += activity.exercise_weight

                if stats.activities_per_range[_range] > 0:
                    stats.avg_reps_per_range[_range] = round(counter_reps / stats.activities_per_range[_range], 2)
                    stats.avg_weight_per_range[_range] = round(counter_weight / stats.activities_per_range[_range], 2)

    return stats.to_clean_dict()

def month_stats_readings(
    range_readings: dict[Any | None, list[date | None]],
    readings: list[models.ReadingLog],
    configure: str
) -> schemas.Stats_readings:
    stats = schemas.Stats_readings()

    if configure == "month":
        iterator = range(1, 13)
    elif configure == "week":
        iterator = range(1, 53)
    else:
        raise ValueError("You have to select month/week")
    
    stats.pages_read_by_range =  dict.fromkeys(iterator, 0)

    for data in range_readings:
        for _range, dates in data.items():

            for date in dates:
                for reading in readings:
                    if reading.date == date:
                        stats.total_readings += 1
                        stats.pages_read_by_range[_range] += reading.pages_read

    return stats.to_clean_dict()

@typechecked
def configure_dates_for_processing(obj: list[models.Activities | models.ReadingLog], _range: str) -> list[dict[Any, list[date | None]]]:   
    """This function remove duplicates and return dates as key week or month in list""" 
    obj_dates = [date.date for date in obj]

    def only_current_year(date):
            if date.year == datetime.now().year:
                return date
            
    # Removing duplicates
    obj_dates = list(set(filter(only_current_year, obj_dates)))

    if _range == "month":
        obj_dates.sort(key= lambda x: x.month)
        range_obj = [
            {k: list(l)}
            for k, l in groupby(obj_dates, key= lambda x: x.month)
        ]
        return range_obj
    
    elif _range == "week":
        obj_dates.sort(key= lambda x: x.isocalendar().week)
        range_obj = [
            {k: list(l)}
            for k, l in groupby(obj_dates, key= lambda x:  x.isocalendar().week)
        ]
        return range_obj

    else:
        raise ValueError("You have to provide month/week")
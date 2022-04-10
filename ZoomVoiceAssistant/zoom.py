import requests
import jwt
import json
from time import time
from datetime import datetime
import webbrowser


api_key = 'JBynnGfrS_6NsktQEz97RA' #Ekansh will have to enter his zoom api details
api_secret = 'Ddnot5eH8BZrW8L9rC9OtoJnpg49OpEmmilF'

def generateToken():
    token = jwt.encode(
        {"iss": api_key, "exp": time() + 5000},
        api_secret,
        algorithm='HS256'
    )
    return token


meetingdetails = {"topic": "temp_title",
                  "type": 2,
                  "start_time": "time",
                  "duration": "1",
                  "timezone": "country",
                  "agenda": "test",

                  "recurrence": {"type": 1,
                                 "repeat_interval": 1
                                 },
                  "settings": {"host_video": "true",
                               "participant_video": "true",
                               "join_before_host": "False",
                               "mute_upon_entry": "False",
                               "watermark": "true",
                               "audio": "voip",
                               "auto_recording": "cloud"
                               }
                  }

def createMeeting():
    headers = {'authorization': 'Bearer %s' % generateToken(),
               'content-type': 'application/json'}
    r = requests.post(
        f'https://api.zoom.us/v2/users/me/meetings',
        headers=headers, data=json.dumps(meetingdetails))

    print("\n creating zoom meeting ... \n")
    #print(r.text)
    # converting the output into json and extracting the details
    y = json.loads(r.text)
    join_URL = y["join_url"]
    meetingID = y["id"]
    meetingPassword = y["password"]

    print(f'\n here is your zoom meeting link {join_URL} \n Your meeting ID is: {meetingID} and your password is: "{meetingPassword}"\n')
    #print(y)


def joinCreatedMeeting():
    headers = {'authorization': 'Bearer %s' % generateToken(),
               'content-type': 'application/json'}
    r = requests.post(
        f'https://api.zoom.us/v2/users/me/meetings',
        headers=headers, data=json.dumps(meetingdetails))

    y = json.loads(r.text)
    join_URL_1 = y["join_url"]
    time_meet = meetingdetails["start_time"]
    final_time = time_meet[15:]

    meet_list = [[join_URL_1, final_time]]

    isStarted = False

    for i in meet_list:
        while True:
            if not isStarted:
                if datetime.now().hour == int(i[1].split(':')[0]) and datetime.now().minute == int(i[1].split(':')[1]):
                    webbrowser.open(i[0])
                    isStarted = True
            #time.sleep(5)

import pyttsx3 as p
import speech_recognition as sr
import zoom

engine = p.init()
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)


def speak(text):
    engine.say(text)
    engine.runAndWait()


r = sr.Recognizer()

with sr.Microphone() as source:
    r.energy_threshold = 10000
    r.adjust_for_ambient_noise(source, 1.2)
    print("listening...")

    audio = r.listen(source)
    text = r.recognize_google(audio)
    print(text)

    if "Bob" in text:
        speak("Hey, what's up? How can I help you")

with sr.Microphone() as source:
    r.energy_threshold = 10000
    r.adjust_for_ambient_noise(source, 1.2)
    print("listening...")

    audio = r.listen(source)
    zoom_text = r.recognize_google(audio)
    print(zoom_text)

    if "zoom meeting" or "video call" in zoom_text:

        speak("What do you want to call your meeting?")

        r.energy_threshold = 10000
        r.adjust_for_ambient_noise(source, 1.2)
        print("listening...")

        audio = r.listen(source)
        text_1 = r.recognize_google(audio)
        print(text_1)
        zoom.meetingdetails.update({'topic': text_1})

        speak("What date do you want to set? Please answer in month month and day day format.")

        r.energy_threshold = 10000
        r.adjust_for_ambient_noise(source, 1.2)
        print("listening...")

        audio = r.listen(source)
        text_2 = r.recognize_google(audio)
        print(text_2)
        meet_date = "2021-"+text_2[:2]+"-"+text_2[2:]+"T10: "

        speak("What time do you want to meet? Please answer in the 24 hour format.")

        r.energy_threshold = 10000
        r.adjust_for_ambient_noise(source, 1.2)
        print("listening...")

        audio = r.listen(source)
        text_3 = r.recognize_google(audio)
        print(text_3)
        meet_time = text_3[:2]+":"+text_3[2:]

        zoom.meetingdetails.update({'start_time': meet_date+meet_time})

        speak("What is the duration of the meeting? Please answer in minutes")

        r.energy_threshold = 10000
        r.adjust_for_ambient_noise(source, 1.2)
        print("listening...")

        audio = r.listen(source)
        text_4 = r.recognize_google(audio)
        print(text_4)

        if "hours" in text_4:
            dur = str(int(text_4[:1]*60))
        else:
            dur = text_4[:1]

        zoom.meetingdetails.update({'duration': dur})

        speak("Which country Time Zone do you prefer?")

        r.energy_threshold = 10000
        r.adjust_for_ambient_noise(source, 1.2)
        print("listening...")

        audio = r.listen(source)
        text_5 = r.recognize_google(audio)
        print(text_5)

        zoom.meetingdetails.update({'timezone': text_5})

        zoom.createMeeting()
        speak("I have created your zoom meeting. I'll open the meeting automatically at the given time")
        #print(zoom.meetingdetails)
        zoom.joinCreatedMeeting()

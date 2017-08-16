# Trippy
A Messenger Bot working as a Trip Advisor.


Trippy was developed with the intention to come up as a Messenger Bot which can help consumers to decide upon several factors including flights,Rails,Buses
when planning a trip.

Technology Stack Used = Facebook Messenger APIs, JSON for data communication,CasperJS,PhantomJS,PHP for processing the data received on Call
Back URL.

Architecture of Trippy :
_____________________________________________________________________________________________________________________________

1. The Bot Receives message from the end user.
2. Facebook Calls the CallBack URL on my hosted site passing a JSON file including SenderID,ReceipientID,Sender Params,Message etc.
3. PHP code parses the Message and then executes the corresponding CasperJS Utility Script to Scrape data from different websites.
4. The CasperJS Scripts basically use a HeadLess Browser provided by PhantomJS which loads the mobile version of sites.
5. The CasperJS scripts scrape the data and then the control returns to PHP.
6. PHP then parses the scraped data to return a well-formated response to end user depending upon the query.

Hosting Methodologies:
_______________________________________________________________________________________________________________________________
1. The Domain https://thetrippy.co.in was set up for trippy to be accessible as a product.
2. But for running NodeJS scripts from PHP you would need a Virtual Private Server apart from shared hosting. Also to test locally 
   tools like ngrok/localtunnel can be used to make your localHost address accessible via Internet(WWW) especially to FaceBook as a
   callBack URL

 Why CasperJS and PhantomJS combination ?
_______________________________________________________________________________________________________________________________
1. I started with NodeJS Library Cherio but then Cherio is only meant for scraping Static HTML websites
2. Then I went onto ScraperJS which has a static Scraper (Internally uses CherioJS) and a dynamic Scraper(Internally uses PhantomJS)
   but then at times dynamic Scraper suffers if the site loads its content using AJAX/Excessive JS leading to page loading issues.
3. CasperJS is built on top of PhantomsJS and is the best Library available for scraping Dynamically loading websites.
4. PHP also comes with CLI to scrape websites which internally uses FireFox Agent which faces certain browser support issues as not 
   most sites these days support FireFox. Hence a heads up for Phantom which is a HeadLess browser.
 

Data Scraped By CasperJS Scripts using CLI Arguments 
________________________________________________________________________________________________________________________________

1. Flights #####################################################################################################################

C:\Users\amitabh\Desktop\Trippy>phantomjs.exe --config=config.json casperjs/bin/
bootstrap.js --casper-path=casperjs --cli home.js flights Mumbai Bangalore 31/08
/2017
[
    "flights",
    "Mumbai",
    "Bangalore",
    "31/08/2017"
]
{
    "casper-path": "casperjs",
    "cli": true
}
just before running......
Continue
running......
There were 70 flights
Suggestions are as follows :

--------------------------------------------------------------------------
29 AUG Rs. 3,135
--------------------------------------------------------------------------
30 AUG Rs. 2,894
--------------------------------------------------------------------------
31 AUG Rs. 2,424
--------------------------------------------------------------------------
01 SEP Rs. 2,894
--------------------------------------------------------------------------
02 SEP Rs. 2,105
--------------------------------------------------------------------------
03 SEP Rs. 2,424
--------------------------------------------------------------------------
Info= Go Air G8-317 06:05 1h 35m 07:40 Rs. 2,424
--------------------------------------------------------------------------
Info= Air India AI-603 06:15 1h 35m 07:50 Rs. 2,475
--------------------------------------------------------------------------
Info= IndiGo 6E-199 06:05 1h 45m 07:50 Rs. 2,484
--------------------------------------------------------------------------
Info= IndiGo 6E-715 07:25 1h 45m 09:10 Rs. 2,484
--------------------------------------------------------------------------
Info= IndiGo 6E-236 09:30 1h 45m 11:15 Rs. 2,484
--------------------------------------------------------------------------
Info= IndiGo 6E-6939 12:30 1h 45m 14:15 Rs. 2,484
--------------------------------------------------------------------------
Info= IndiGo 6E-3177 15:45 1h 40m 17:25 Rs. 2,484
--------------------------------------------------------------------------
Info= IndiGo 6E-628/ 265 18:55 3h 40m 22:35 Rs. 2,484
--------------------------------------------------------------------------
Info= Jet Airways 9W-415 14:55 1h 40m 16:35 Rs. 2,633
--------------------------------------------------------------------------
Info= Go Air G8-382 14:30 1h 40m 16:10 Rs. 2,797
--------------------------------------------------------------------------
Info= Go Air G8-396 20:55 1h 40m 22:35 Rs. 2,797
--------------------------------------------------------------------------
Info= Go Air G8-247 22:10 1h 25m 23:35 Rs. 2,797
--------------------------------------------------------------------------
Info= IndiGo 6E-834/ 357 16:45 3h 40m 20:25 Rs. 2,894
--------------------------------------------------------------------------
Info= IndiGo 6E-5533 17:05 1h 45m 18:50 Rs. 2,894
--------------------------------------------------------------------------
Info= IndiGo 6E-463 17:40 1h 45m 19:25 Rs. 2,894
--------------------------------------------------------------------------
Info= IndiGo 6E-949 20:30 1h 45m 22:15 Rs. 2,894
--------------------------------------------------------------------------
Info= IndiGo 6E-825 21:30 1h 45m 23:15 Rs. 2,894
--------------------------------------------------------------------------
Info= IndiGo 6E-565 22:30 1h 45m 00:15 Rs. 2,894
--------------------------------------------------------------------------
Info= Spicejet SG-497 08:25 1h 45m 10:10 Rs. 2,895
--------------------------------------------------------------------------
Info= Spicejet SG-634 12:55 1h 35m 14:30 Rs. 2,895
--------------------------------------------------------------------------
Info= Jet Airways 9W-411 06:30 1h 45m 08:15 Rs. 2,948
--------------------------------------------------------------------------
Info= Jet Airways 9W-397 08:40 1h 50m 10:30 Rs. 2,948
--------------------------------------------------------------------------
Info= Jet Airways 9W-413 15:50 1h 40m 17:30 Rs. 2,948
--------------------------------------------------------------------------
Info= Jet Airways 9W-477 20:20 1h 40m 22:00 Rs. 2,948
--------------------------------------------------------------------------
Info= Jet Airways 9W-7145 03:00 1h 35m 04:35 Rs. 3,053
--------------------------------------------------------------------------
Info= Jet Airways 9W-394 13:30 1h 40m 15:10 Rs. 3,053
--------------------------------------------------------------------------
Info= Jet Airways 9W-495 21:30 1h 35m 23:05 Rs. 3,053
--------------------------------------------------------------------------
Info= Jet Airways 9W-348 03:00 5h 30m 08:30 Rs. 3,165
--------------------------------------------------------------------------
Info= Air India AI-639 09:20 1h 40m 11:00 Rs. 3,179
--------------------------------------------------------------------------
Info= Air India AI-607 16:45 1h 45m 18:30 Rs. 3,179
--------------------------------------------------------------------------
Info= Air India AI-609 20:15 1h 30m 21:45 Rs. 3,179
--------------------------------------------------------------------------
Info= Spicejet SG-467/ 1233 13:05 4h 10m 17:15 Rs. 3,345
--------------------------------------------------------------------------
Info= IndiGo 6E-264/ 187 15:15 4h 25m 19:40 Rs. 3,393
--------------------------------------------------------------------------
Info= IndiGo 6E-628/ 511 18:55 4h 40m 23:35 Rs. 3,393
--------------------------------------------------------------------------
Info= IndiGo 6E-799 19:10 1h 35m 20:45 Rs. 3,393
--------------------------------------------------------------------------
Info= Spicejet SG-415 18:05 1h 50m 19:55 Rs. 3,394
--------------------------------------------------------------------------
Info= Jet Airways 9W-483 18:00 1h 40m 19:40 Rs. 3,646
--------------------------------------------------------------------------
Info= Jet Airways 9W-7011 18:40 1h 40m 20:20 Rs. 3,646
--------------------------------------------------------------------------
Info= Air India AI-617 13:55 17h 40m 07:35 Rs. 3,874
--------------------------------------------------------------------------
Info= Air India AI-619 19:30 12h 05m 07:35 Rs. 3,874
--------------------------------------------------------------------------
Info= Air India AI-50 20:50 10h 45m 07:35 Rs. 3,874
--------------------------------------------------------------------------
Info= Spicejet SG-703/ 1035 22:45 8h 35m 07:20 Rs. 4,101
--------------------------------------------------------------------------
Info= Air India AI-33 02:10 15h 45m 17:55 3Stop
--------------------------------------------------------------------------
Info= Air India AI-83 05:10 12h 45m 17:55 3Stop
--------------------------------------------------------------------------
Info= Air India AI-615 06:15 25h 20m 07:35 Rs. 4,478
--------------------------------------------------------------------------
Info= Air India AI-617 13:55 4h 00m 17:55 Rs. 4,533
--------------------------------------------------------------------------
Info= Air India AI-570 06:15 8h 05m 14:20 Rs. 4,722
--------------------------------------------------------------------------
Info= IndiGo 6E-711/ 714 13:45 4h 00m 17:45 Rs. 4,784
--------------------------------------------------------------------------
Info= Jet Airways 9W-7178 10:25 1h 40m 12:05 Rs. 4,864
--------------------------------------------------------------------------
Info= Jet Airways 9W-348 03:00 15h 40m 18:40 Rs. 4,895
--------------------------------------------------------------------------
Info= Jet Airways 9W-451 16:20 16h 10m 08:30 Rs. 4,895
--------------------------------------------------------------------------
Info= Jet Airways 9W-826 17:30 15h 00m 08:30 Rs. 4,895
--------------------------------------------------------------------------
Info= Jet Airways 9W-455 19:25 13h 05m 08:30 Rs. 4,895
--------------------------------------------------------------------------
Info= Air India AI-663 13:30 16h 05m 05:35 Rs. 4,990
--------------------------------------------------------------------------
Info= Air India AI-661 16:50 12h 45m 05:35 Rs. 4,990
--------------------------------------------------------------------------
Info= Air India AI-683 21:05 8h 30m 05:35 Rs. 4,990
--------------------------------------------------------------------------
Info= Jet Airways 9W-469 15:25 16h 30m 07:55 Rs. 5,000
--------------------------------------------------------------------------
Info= Air India AI-619 19:30 22h 25m 17:55 Rs. 5,041
--------------------------------------------------------------------------
Info= Air India AI-50 20:50 21h 05m 17:55 Rs. 5,041
--------------------------------------------------------------------------
Info= Jet Airways 9W-463 03:05 4h 50m 07:55 Rs. 5,105
--------------------------------------------------------------------------
Info= Air India AI-615 06:15 11h 40m 17:55 Rs. 5,645
--------------------------------------------------------------------------
Info= Jet Airways 9W-491 05:35 4h 25m 10:00 Rs. 5,756
--------------------------------------------------------------------------
Info= Jet Airways 9W-491 05:35 6h 05m 11:40 Rs. 5,809
--------------------------------------------------------------------------
Info= Vistara UK-970 08:45 10h 05m 18:50 Rs. 5,897
--------------------------------------------------------------------------
Info= Vistara UK-970 08:45 11h 20m 20:05 Rs. 5,897
--------------------------------------------------------------------------
Info= Vistara UK-994 10:25 8h 25m 18:50 Rs. 5,897
--------------------------------------------------------------------------
Info= Vistara UK-994 10:25 9h 40m 20:05 Rs. 5,897
--------------------------------------------------------------------------
Info= Vistara UK-902 15:45 7h 30m 23:15 Rs. 5,897
--------------------------------------------------------------------------
Info= Jet Airways 9W-465 07:15 4h 25m 11:40 Rs. 6,071
--------------------------------------------------------------------------
Info= Jet Airways 9W-339 03:00 6h 50m 09:50 Rs. 6,109
[error] [phantom]
Done

Done


**********************************************************************************************************************************


2. Buses #########################################################################################################################

C:\Users\amitabh\Desktop\Trippy>phantomjs.exe --config=config.json casperjs/bin/
bootstrap.js --casper-path=casperjs --cli home.js buses Mumbai Bangalore 31/08/2
017
[
    "buses",
    "Mumbai",
    "Bangalore",
    "31/08/2017"
]
{
    "casper-path": "casperjs",
    "cli": true
}
URL loaded......
Continue
running......
_______________________________________________________________
Canara Pinto Travels
 Volvo A/C -Multi Axle Semi sleeper (2+2)
 15:00
 07:30
 16 h 30m2 Rest Stop
 4.1/5(568 Ratings)
 10
 5
  1450

_______________________________________________________________
Orange Tours And Travels
 A/C Sleeper (2+1)
 16:00
 09:00
 17 h 00m
 4.1/5(304 Ratings)
 36
 24
  2000

_______________________________________________________________
Jabbar Travels
 Scania AC Multi Axle Semi Sleeper(2+2)
 15:00
 07:30
 16 h 30m
 4.3/5(255 Ratings)
 44
 20
  1425

_______________________________________________________________
Anand travel
 Volvo A/C Multi Axle Sleeper(2+1)
 16 h
 00m
 4.2/5(231 Ratings)
 36
 24
  1950
 INR 2000

_______________________________________________________________
VRL Travels
 I-Shift Multi Axle Volvo A/C Sleeper (2+1)
 14:00
 06:30
 16 h 30m
 4/5(282 Ratings)
 36
 24
  1800

_______________________________________________________________
SRS Travels
 Scania AC Multi Axle Semi Sleeper(2+2)
 14:30
 06:00
 15 h 30m
 3.9/5(170 Ratings)
 46
 23
  1000

_______________________________________________________________
VRL Travels
 I-Shift Multi Axle Volvo A/C Sleeper (2+1)
 16:00
 08:30
 16 h 30m
 3.8/5(151 Ratings)
 36
 24
  1800

_______________________________________________________________
Anand travel
 A/C Sleeper (2+1)
 18:30
 10:30
 16 h 00m
 3.5/5(261 Ratings)
 30
 20
  1950

_______________________________________________________________
Canara Pinto Travels
 A/C Sleeper (2+1)
 16:00
 08:00
 16 h 00m1 Rest Stop
 3.4/5(247 Ratings)
 18
 12
  1750

_______________________________________________________________
VRL Travels
 Volvo Multi Axle SemiSleeper I-Shift B11R (2+2)
 12:30
 05:30
 17 h 00m
 3.9/5(104 Ratings)
 52
 25
  1200

_______________________________________________________________
VRL Travels
 Volvo Multi Axle SemiSleeper I-Shift B11R (2+2)
 15:30
 08:30
 17 h 00m
 3.8/5(123 Ratings)
 50
 24
  1200

_______________________________________________________________
VRL Travels
 Volvo Multi Axle SemiSleeper I-Shift B11R (2+2)
 23:00
 15:50
 16 h 50m
 3.7/5(133 Ratings)
 52
 25
  1200

_______________________________________________________________
Sharma Transports
 Volvo A/C Multi Axle Semi Sleeper (2+2)
 12:15
 06:00
 17 h 45m
 3.8/5(112 Ratings)
 39
 20
  1429

_______________________________________________________________
VRL Travels
 I-Shift Multi Axle Volvo A/C Sleeper (2+1)
 22:30
 15:00
 16 h 30m
 3.6/5(113 Ratings)
 36
 24
  1800

_______________________________________________________________
Jabbar Travels
 A/C Sleeper (2+1)
 16:45
 08:45
 16 h 00m
 3.6/5(107 Ratings)
 30
 20
  1615

_______________________________________________________________
SRS Travels
 Scania AC Multi Axle Semi Sleeper(2+2)
 19:30
 11:45
 16 h 15m
 3.6/5(85 Ratings)
 47
 23
  1000

_______________________________________________________________
Canara Pinto Travels
 A/C Sleeper (2+1)
 19:00
 10:30
 15 h 30m1 Rest Stop
 2.8/5(165 Ratings)
 20
 14
  1550

_______________________________________________________________
Sharma Transports
 Volvo A/C Multi Axle Sleeper(2+1)
 20:30
 13:15
 16 h 45m
 3.4/5(145 Ratings)
 29
 19
  2095

_______________________________________________________________
SRS Travels
 Volvo A/C Multi Axle Sleeper(2+1)
 15:00
 07:15
 16 h 15m
 3.5/5(64 Ratings)
 34
 23
  1600

[error] [phantom]
Done

Done


***********************************************************************************************************************************

3. Trains #########################################################################################################################


C:\Users\amitabh\Desktop\Trippy>phantomjs.exe --config=config.json casperjs/bin/
bootstrap.js --casper-path=casperjs --cli home.js trains Kalyan Jabalpur 31/08/2
017 3A
[
    "trains",
    "Kalyan",
    "Jabalpur",
    "31/08/2017",
    "3A"
]
{
    "casper-path": "casperjs",
    "cli": true
}
CHHAPRA EXPRESS
 11059
 10:55
 01:45
 Rs. 1,200

_______________________________________________________________
MAHANAGARI EXP
 11093
 00:10
 16:10
 Rs. 1,210

_______________________________________________________________
LTT PPTA EXPRESS
 12141
 23:35
 14:15
 Rs. 1,255

_______________________________________________________________
LTT BSB SUP EXP
 12167
 00:35
 16:30
 Rs. 1,255

_______________________________________________________________
VSG PATNA EXP
 12741
 07:35
 23:00
 Rs. 1,255

_______________________________________________________________
LTT RJPB EXP
 13202
 22:15
 15:55
 Rs. 1,210

_______________________________________________________________
DARBHANGA EXP
 11061
 12:15
 03:30
 Rs. 1,205

_______________________________________________________________
KOLKATA MAIL
 12322
 21:30
 13:10
 Rs. 1,255

_______________________________________________________________
LTT BSB SUP EXP
 12165
 05:23
 20:40
 Rs. 1,250

_______________________________________________________________
JBP GARIB RATH
 12188
 13:30
 06:00
 Rs. 830

_______________________________________________________________
BHAGALPUR EXP
 12336
 08:05
 23:20
 Rs. 1,255

_______________________________________________________________
GORAKHPUR EXP
 15017
 06:35
 00:55
 Rs. 1,210

[error] [phantom]
Done

Done

***************************************************************************************************************************************

These Data Sets can then be used to answer user Queries like in case of flights :
1. User needs to check flights of only a specific AirLine
2. User needs to leave the source city in a specific time slot of a day say 3pm to 6pm
3. User needs to reach the destination in a specific time slot.
4. User needs the cheapest flight
5. Also we give suggestions to user in the form of cheapest flight available on 6 consecutive days
   (Like if he wants to travle on nth day we calculate the prices for n-3,n-2,.......n+3 th day.
   
   So on.....

# Upworker
Upwork RSS feed scraper featuring audible alerts

Upwork provides RSS feeds for searching jobs. Mozilla Thunderbird's minimal
update loop interval equals to 1 minute. Too slow!

This little script makes requests every 10 seconds while looking exactly like
Thunderbird within the server logs. It also highlights URLs with matching
keywords within its output and makes audible alerts via text-to-speech engine.

I used this script for months with no problem, receiving audible notifications
and contacting the employers ahead of anyone else. However, if you do get banned
for using it, please don't blame me -- it's just a scraper that I made, it's up
to you either to use it or not with your own Upwork account.

Command to generate text-to-speech files:

    pico2wave [keyword] -w=sounds/t2s/[keyword].wav

Installation:

    make config
    npm i

Running:

    make run

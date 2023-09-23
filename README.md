# Upworker

Upwork RSS feed scraper featuring audible alerts.

Upwork provides RSS feeds for searching jobs.  Mozilla Thunderbird's minimal
update loop interval equals to 1 minute.  Too slow!

This little script makes requests every 10 seconds while looking exactly like
Thunderbird within the server logs.  It also highlights URLs with matching
keywords within its output and makes audible alerts via text-to-speech engine.

I used this script for months with no problem, receiving audible notifications
and contacting the employers ahead of anyone else.  However, if you do get banned
for using it, please don't blame me — it's just a scraper that I made, it's up
to you either to use it or not with your own Upwork account.


## Configuration

1. Run `make config.js`
1. Open [upwork.com job search](https://www.upwork.com/nx/jobs/search/) in your browser
1. Enter search query, click on green RSS/Atom icon, copy the URL
1. Edit `config.js` and paste the RSS/Atom URL inte "urls" array
1. Optionally, add important keyword(s) to "keywords" (e.g. "vue", "rust", etc)
1. Save the file and run the scraper


## How to run using Docker

```console
make run
```


---


## How to install dependencies

```console
make INSTALL_DEPS
```


## How to run

```console
make RUN
```

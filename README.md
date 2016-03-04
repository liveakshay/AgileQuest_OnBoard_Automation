# agilequest_onboard_automation
Two scripts - to automate two uses cases in AgileQuest.com OnBoard software.  One to automate seat-booking and the other to automate check-in (customized to a specific version, may need tweaks depending on the each enterprise's setup). 

Setup steps at a high level, to run these scripts every midnight/morning: 

1. Install Node.
2. Using npm, install 'selenium' and 'selenium webdriver', then setup chrome-driver (install Google Chrome browser first, if you haven't already).
3. Setup a cron-job that runs the book_seat.sh script every midnight - this script runs the selenium script BookSeat.js and also arranges so your system wakes up in time for the morning run, see below).
4. Setup a cron-job that runs the check_in.sh script every morning at 8:01 am (or another coordinated time of your choosing) - this script runs the selenium script CheckIn.js. 
5. Setup an email address where cron-job run results will be emailed (so you will know if it errored out and will be able to manually recover etc).  See crontab settings file.
5. Pre-requisite - each agile-quest user will need to have some basic 'account settings' modified, in preparation for this automation to work.  For e.g. 'express check-in' must be enabled so AgileQuest shows the 'Check In' button on home-screen.  See settings screenshot. 



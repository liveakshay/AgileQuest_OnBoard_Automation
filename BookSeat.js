// http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver_By.html
// http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver.html

var type = (function (global) {
    var cache = {};
    return function (obj) {
        var key;
        return obj === null ? 'null' // null
            : obj === global ? 'global' // window in browser or global in nodejs
            : (key = typeof obj) !== 'object' ? key // basic: string, boolean, number, undefined, function
            : obj.nodeType ? 'object' // DOM element
            : cache[key = ({}).toString.call(obj)] // cached. date, regexp, error, object, array, math
            || (cache[key] = key.slice(8, -1).toLowerCase()); // get XXXX from [object XXXX], and cache it
    };
}(this));

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(prefix) {
        return this.slice(0, prefix.length) == prefix;
    };
}
 
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.slice(-suffix.length) == suffix;
    };
}

Date.prototype.addDays = function (days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Date.prototype.format=function (format)
{
	var mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var fullMon=['January','February','March','April','May','June','July','August','September','October','November','December'];
	var days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	var fullDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	
	if (!format) { format="MM/dd/yyyy"; }
	
	var  regex=new RegExp("DDDD","g");
	format=format.replace(regex, fullDays[this.getDay()]);
	
	regex=new RegExp("DDD","g");
	format=format.replace(regex, days[this.getDay()]);

	regex=new RegExp("dd","g");
	format=format.replace(regex,this.getDate());

	regex=new RegExp("MMMM","g");
	format=format.replace(regex, fullMon[this.getMonth()]);

	regex=new RegExp("MMM","g");
	format=format.replace(regex, mon[this.getMonth()]);

	regex=new RegExp("MM","g");
	format=format.replace(regex,this.getMonth()+1);

	regex=new RegExp("yyyy","g");
	format=format.replace(regex, this.getFullYear());

	regex=new RegExp("yy","g");
	format=format.replace(regex, this.getFullYear().toString().substr(2,2));

	regex=new RegExp("mm","g");
	format=format.replace(regex, this.getMinutes());

	regex=new RegExp("hh","g");
	format=format.replace(regex, this.getHours());

	regex=new RegExp("ss","g");
	format=format.replace(regex, this.getSeconds());

	regex=new RegExp("ms","g");
	format=format.replace(regex, this.getMilliseconds());

	return format;
}

var webdriver = require('selenium-webdriver');

function makeReservation(sUser, sPassword, nSeat, sSeatLabel, arrDayFlags) {

	var driver = new webdriver.Builder()
	 	.withCapabilities(webdriver.Capabilities.chrome())
	  	.build();

	var nSleep = 1000;
	driver.manage().timeouts().implicitlyWait(nSleep);

	// var baseDate = new Date(2015,7,20);  //Month is indexed at 0, so April is 3.
	var baseDate = new Date(); 
	var nextDate = baseDate.addDays(14);

	//0:Sunday, 1:Monday, 2:Tesday, 3:Wednesday, 4:Thursday, 5:Friday, 6:Saturday
	var weekday = nextDate.getDay();

	var boolNextMonth = (baseDate.getMonth() != nextDate.getMonth());
	var cellNum = new Number(nextDate.format('dd'));

	driver.wait(function() {

		//go to login page
		driver.get('https://cox.agilquest.com/mobile')  //Welcome to AgilQuest's OnBoard® Mobile 
		  	.then(function (res) {
				console.log('.');
				console.log('.');

				if(weekday == 0) {
					// console.log('Skipping run on a Sunday (weekend) for ' + sUser + ', was trying to book seat ' + sSeatLabel);
					throw '!SUN: Skipping run on a Sunday (weekend) for ' + sUser + ', was trying to book seat ' + sSeatLabel; 
				} else if(weekday == 6) {
					// console.log('Skipping run on a Saturday (weekend) for ' + sUser + ', was trying to book seat ' + sSeatLabel);
					throw '!SAT: Skipping run on a Saturday (weekend) for ' + sUser + ', was trying to book seat ' + sSeatLabel; 
				} else if(arrDayFlags[weekday-1] == 0) {
					// console.log('Skipping run on a blocked weekday for ' + sUser + ', was trying to book seat ' + sSeatLabel + '.  arrDayFlags = ' + arrDayFlags);
					throw '!BLKD: Skipping run on a blocked weekday for ' + sUser + ', was trying to book seat ' + sSeatLabel + '.  arrDayFlags = ' + arrDayFlags; 
				}

				console.log('running book_seat for ' + sUser + ', trying to book seat: ' + sSeatLabel);
				console.log('booking for next date: ' + nextDate);
		  	});

		//log in
		driver.wait(webdriver.until.elementLocated(webdriver.By.name('username'), nSleep))
			.then(function (elem) {
				elem.sendKeys(sUser);
			});

		driver.wait(webdriver.until.elementLocated(webdriver.By.name('password'), nSleep))
			.then(function (elem) {
				elem.sendKeys(sPassword);
			});

		driver.wait(webdriver.until.elementLocated(webdriver.By.name('continue'), nSleep))
			.then(function (elem) {
				elem.click();
			});

		//goto make new reservation
		driver.wait(webdriver.until.elementLocated(webdriver.By.name('btnMakeResv'), nSleep))
			.then(function (elem) {
				elem.click();
			});

		//open up the calendar widget
		driver.wait(webdriver.until.elementLocated(webdriver.By.id("startDateDisplay"), nSleep))
			.then(function (elem) {
				elem.click();
			});

		if(boolNextMonth) {
			//click to next month
			driver.findElement(webdriver.By.className('calnavright')).click();
		}

		//select the date
		driver.wait(webdriver.until.elementLocated(webdriver.By.xpath("//*[@class='selector' and text()='" + cellNum + "']"), nSleep))
			.then(function (elem) {
				elem.click();
			});


		//fill out the start and end time
		// driver.findElement(webdriver.By.id('startTimeInternal')).sendKeys('09:00 AM');//id: startTimeInternal
		// driver.findElement(webdriver.By.id('endTimeInternal')).sendKeys('05:00 PM');//id: endTimeInternal

		//click search button
		driver.findElement(webdriver.By.id('searchBtn')).click();//span id: searchBtn
		driver.sleep(nSleep);

		//Find seat.  If seat not found on page 1, go to page 2 (this code won't go to page 3. ever).  Then select the seat.
		driver.isElementPresent(webdriver.By.xpath('//input[@type="radio" and @name="ouidResource" and @value="' + nSeat + '"]'))
			.then(function (bPresent) {
				if(!bPresent) {
					driver.wait(webdriver.until.elementLocated(webdriver.By.xpath('//a[@href="javascript:submitAxPaging(\'reservationListResultsForm\',\'20\');"]')), nSleep)
						.then(function (elem) {
							elem.click();
						});
				}

				driver.wait(webdriver.until.elementLocated(webdriver.By.xpath('//input[@type="radio" and @name="ouidResource" and @value="' + nSeat + '"]')), nSleep)
					.then(function (elem) {
						elem.click();
					});
			});


		//Click Continue
		driver.wait(webdriver.until.elementLocated(webdriver.By.xpath("//input[@type='button' and @class='btntext' and @value='Continue']")), nSleep)
			.then(function (elem) {
				elem.click();
			});

		// Click Submit
		driver.wait(webdriver.until.elementLocated(webdriver.By.xpath("//input[@type='button' and @class='btntext' and @value='Submit']")), nSleep)
			.then(function (elem) {
				elem.click();
				console.log("successfully booked seat " + sSeatLabel + " for " + sUser + ", on " + nextDate + "!");
			});

		return 1;
	}, (nSleep*10))
		.then(null, function(err) {
			console.log(err.message);
			if(err.message.startsWith('!SUN') || err.message.startsWith('!SAT') || err.message.startsWith('!BLKD')) {
				//move on...
			} else {
				console.error(err.stack);
			}
			return 1;
		});

	driver.sleep(nSleep*2);

	driver.quit();
}

console.log('today:' + new Date());

// make reservation using username, password, seat preference (D1=19), with boolean flags for each weekday.  The
// 'seat number' (19) can be found by inspecting HTML Radio button values of the preferred seat on the UI 
// (hint: seat numbers are incremental & static, so D1 is always 19, and D2 is always 20, and so on)  
makeReservation('_your_username', '_your_password', 19, 'D1', [1,1,0,0,1]);

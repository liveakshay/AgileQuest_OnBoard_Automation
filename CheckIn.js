// http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver_By.html
// http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver.html

var nSleep = 1000;

console.log('.');
baseDate = new Date();
console.log('checking in for today: ' + baseDate);

function checkInUser(sUser, sPassword) {
	var webdriver = require('selenium-webdriver');

	var driver = new webdriver.Builder().
	   withCapabilities(webdriver.Capabilities.chrome()).
	   build();

	driver.manage().timeouts().implicitlyWait(nSleep);

	driver.wait(function() {

		driver.get('https://cox.agilquest.com/mobile'); //Welcome to AgilQuest's OnBoard® Mobile 

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

		driver.wait(webdriver.until.elementLocated(webdriver.By.name('btnCheckIn'), nSleep))
			.then(function (elem) {
				console.log('checking in ' + sUser + '...');
				elem.click();
			})
			.then(function() {
				console.log('DONE checking in ' + sUser + '...');
				return 1;
			});

		return 1;
	}, (nSleep*5))
		.then(null, function(err) {
			console.log(err);
			console.error(err.stack);
			return 1;
		});


	driver.sleep(nSleep*2);

	driver.quit();
}

//check in user by username and password (assumes 'fast check-in' button is available on home-screen, by way of user account settings).
checkInUser('_your_username', '_your_password');

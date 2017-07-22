/**
 * 在nightwatch.config.js中使用globals_path获得此文件
 * 此文件在测试前后开启、关闭chromedriver
 */
var chromedriver = require('chromedriver');


var HtmlReporter = require('nightwatch-html-reporter');
var reporter = new HtmlReporter({
    openBrowser: true,
    reportsDirectory: __dirname + '/reports',
    relativeScreenshots: true,
    themeName:'compact'
});

function startChromeDriver() {
  chromedriver.start();
}

function stopChromeDriver() {
  chromedriver.stop();
}

module.exports = {
  before : function(next) {
    startChromeDriver.call(this);
    next();
  },

  after : function(next) {
    stopChromeDriver.call(this);
    next();
  },
    reporter: reporter.fn
};
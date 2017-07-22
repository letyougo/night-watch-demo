/**
 * nightwatch的配置文件
 * 使用choromedriver而不是selenium驱动谷歌浏览器
 */

module.exports = {
  'src_folders': ['test/e2e'],
  'output_folder': 'test/reports',
  // 'custom_assertions_path': ['test/custom-assertions'],
  'globals_path' : "test/global.js",

  'selenium': {
    'start_process': false
  },

  'test_settings': {
    'default': {
      'selenium_port': 9515,
      'selenium_host': 'localhost',
      'silent': true,
      'default_path_prefix' : "",
      'desiredCapabilities': {
        'browserName': "chrome",
        'chromeOptions' : {
          'args' : ["--no-sandbox"]
        },
        'acceptSslCerts': true
      },
      'globals': {
        'productListUrl': 'http://localhost:' + 9003 + '/productlist.html',
      }
    }
    // ,
    // 'phantomjs': {
    //   'desiredCapabilities': {
    //     'browserName': 'phantomjs',
    //     'javascriptEnabled': true,
    //     'phantomjs.binary.path':'test/e2e/bin/phantomjs',
    //     'acceptSslCerts': true
    //   }
    // }
  }
};

// 使用phantomjs的配置文件
// module.exports = {
//   'src_folders': ['test/e2e/specs'],
//   'output_folder': 'test/e2e/reports',
//   'custom_assertions_path': ['test/e2e/custom-assertions'],
//
//   'selenium': {
//     'start_process': true,
//     'server_path': require('selenium-server').path,
//     'host': '127.0.0.1',
//     'port': 4444,
//     'cli_args': {
//       'webdriver.chrome.driver': require('chromedriver').path
//     }
//   },
//
//   'test_settings': {
//     'default': {
//       'selenium_port': 4444,
//       'selenium_host': 'localhost',
//       'silent': true,
//       'globals': {
//         'productListUrl': 'http://localhost:' + 9003 + '/productlist.html',
//       }
//     },
//
//     'chrome': {
//       'desiredCapabilities': {
//         'browserName': 'chrome',
//         'javascriptEnabled': true,
//         'acceptSslCerts': true
//       }
//     },
//
//     'phantomjs': {
//       'desiredCapabilities': {
//         'browserName': 'phantomjs',
//         'javascriptEnabled': true,
//         'phantomjs.binary.path':'test/e2e/bin/phantomjs',
//         'acceptSslCerts': true
//       }
//     }
//   }
// };

'use strict';
var generators = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');

var AngularAspnetGenerator = generators.Base.extend({
  initializing: {
    init: function() {
      this.argument('name', {
        type: String,
        required: false
      });
      this.appname = this.name || path.basename(process.cwd());
      this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

      this.log(this.yeoman);
      this.log(chalk.yellow('I can help you create a new application using AngularJS and ASP.NET.'));

      this.props = {};
    },
    checkYoRc: function() {
      var done = this.async();

      if (this.config.get('props')) {
        this.prompt([{
          type: 'confirm',
          name: 'skipConfig',
          message: 'Existing ' + chalk.green('.yo-rc') + ' configuration found, would you like to use it?',
          default: true,
        }], function(answers) {
          this.skipConfig = answers.skipConfig;

          done();
        }.bind(this));
      } else {
        done();
      }
    }
  },
  prompting: {
    promptClient: function() {
      if (this.skipConfig) return;

      this.log('Let\'s configure the client first.');

      var done = this.async();

      this.prompt([{
        type: 'list',
        name: 'script',
        message: 'What would you like to use to write script?',
        choices: ['JavaScript', 'CoffeeScript'],
        filter: function(val) {
          var map = {
            'JavaScript': 'js',
            'CoffeeScript': 'coffee'
          };
          return map[val];
        }
      }, {
        type: 'list',
        name: 'build',
        message: 'What would you like to use as a build engine?',
        choices: ['Gulp', 'Grunt'],
        filter: function(val) {
          return val.toLowerCase();
        }
      }, {
        type: 'list',
        name: 'angular',
        message: 'Which version of AngularJS do you want to use?',
        choices: [{
          name: 'Latest (1.3.x)',
          value: '1.3.x'
        }, {
          name: 'Legacy (1.2.x)',
          value: '1.2.x'
        }]
      }, {
        type: 'checkbox',
        name: 'modules',
        message: 'Which AngularJS modules will you need?',
        choices: [{
          'value': {
            'name': 'angular-animate',
            'module': 'ngAnimate'
          },
          'name': 'angular-animate',
          'checked': true
        }, {
          'value': {
            'name': 'angular-cookies',
            'module': 'ngCookies'
          },
          'name': 'angular-cookies',
          'checked': true
        }, {
          'value': {
            'name': 'angular-touch',
            'module': 'ngTouch'
          },
          'name': 'angular-touch',
          'checked': true
        }, {
          'value': {
            'name': 'angular-sanitize',
            'module': 'ngSanitize'
          },
          'name': 'angular-sanitize',
          'checked': true
        }]
      }, {
        type: 'list',
        name: 'router',
        message: 'Which AngularJS router would you like to use?',
        choices: [{
          'value': {
            'name': 'angular-route',
            'module': 'ngRoute'
          },
          'name': 'ngRoute'
        }, {
          'value': {
            'name': 'angular-ui-router',
            'version': '0.2.x',
            'module': 'ui.router'
          },
          'name': 'ui-router'
        }, {
          'value': {
            'name': null,
            'version': null,
            'module': null
          },
          'name': 'None'
        }]
      }, {
        type: 'list',
        name: 'stylesheet',
        message: 'What would you like to write stylesheets with?',
        choices: ['LESS', 'SASS', 'Plain CSS'],
        filter: function(val) {
          if (val === 'Plain CSS') return 'css';
          return val.toLowerCase();
        }
      }, {
        type: 'list',
        name: 'frontend',
        message: 'What front-end framework do you want to use?',
        choices: function(answers) {
          var values = ['None', 'Bootstrap', 'Foundation'];

          if (answers.stylesheet === 'less') values.splice(2, 1);

          return values;
        },
        filter: function(val) {
          return val.toLowerCase();
        }
      }, {
        type: 'confirm',
        name: 'uibootstrap',
        message: 'Would you like to include ui-bootstrap?',
        default: true,
        when: function(answers) {
          return answers.frontend == 'bootstrap';
        }
      }, {
        type: 'confirm',
        name: 'angularfoundation',
        message: 'Would you like to include Angular Foundation?',
        default: true,
        when: function(answers) {
          return answers.frontend == 'foundation';
        }
      }], function(answers) {
        this.props[answers.script] = true;
        this.props[answers.build] = true;
        this.props.angular = answers.angular;
        this.props.modules = answers.modules;
        this.props.router = answers.router;
        this.props[answers.stylesheet] = true;
        if (answers.frontend != 'none') this.props[answers.frontend] = true;
        this.props.uibootstrap = !!answers.uibootstrap;
        this.props.angularfoundation = !!answers.angularfoundation;

        done();
      }.bind(this));
    },
    promptServer: function() {
      if (this.skipConfig) return;
    }
  },
  configuring: {
    saveSettings: function() {
      if (this.skipConfig) return;
      this.config.set('props', this.props);

    }
  },
  end: {
    done: function() {
      this.log('All finished.');
    }
  }
});

module.exports = AngularAspnetGenerator;

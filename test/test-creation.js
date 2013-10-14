/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;
var fs = require('fs');

describe('wp-underscores generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('wp-underscores:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      ['bower.json', /"name":\s+"test-theme"/],
      ['package.json', /"name":\s+"test-theme"/],
      'Gruntfile.js',
      '.gitignore',
      'css/sass/main.scss',
      'fonts',
      'images',
      'js/vendor',
      'js/theme.js',
      ['index.php', new RegExp("@package Test theme", 'g')],
      ['style.css', new RegExp("Theme Name: Test theme\nTheme URI: TestURL\nAuthor: Test Author\nAuthor URI: TestAuthorURL\nDescription: Test Description", 'g')]
    ];
    helpers.mockPrompt(this.app, {
      themename: 'Test theme',
      themeuri: 'TestURL',
      author: 'Test Author',
      authoruri: 'TestAuthorURL',
      themedescription: 'Test Description',
      sassBootstrap: false
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

});

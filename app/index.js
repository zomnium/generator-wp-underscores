'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

var hello =
chalk.blue.bold("\n ______________") +
chalk.blue.bold("\n< Hello, you!  >") +
chalk.blue.bold("\n --------------") +
chalk.red("\n      ") + chalk.blue.bold("\\") + chalk.red("                    / \\  //\\") +
chalk.red("\n       ") + chalk.blue.bold("\\") + chalk.red("    |\\___/|      /   \\//  \\\\") +
chalk.red("\n            /") + chalk.yellow("0  0") + chalk.red("  \\__  /    //  | \\ \\") +
chalk.red("\n           /     /  \\/_/    //   |  \\  \\") +
chalk.red("\n           @_^_@'/   \\/_   //    |   \\   \\") +
chalk.yellow("\n           //") + chalk.red("_^_/     \\/_ //     |    \\    \\") +
chalk.yellow("\n        ( //)") + chalk.red(" |        \\///      |     \\     \\") +
chalk.yellow("\n      ( / /) ") + chalk.red("_|_ /   )  //       |      \\     _\\") +
chalk.yellow("\n    ( // /) ") + chalk.red("'/,_ _ _/  ( ; -.    |    _ _\\.-~        .-~~~^-.") +
chalk.yellow("\n  (( / / )) ") + chalk.red(",-{        _      `-.|.-~-.           .~         `.") +
chalk.yellow("\n (( // / ))  ") + chalk.red("'/\\      /                 ~-. _ .-~      .-~^-.  \\") +
chalk.yellow("\n (( /// ))      ") + chalk.red("`.   {            }                   /      \\  \\") +
chalk.yellow("\n  (( / ))     ") + chalk.red(".----~-.\\        \\-'                 .~         \\  `. \\^-.") +
"\n             " + chalk.red("///.----..>        \\             _ -~             `.  ^-`  ^-_") +
"\n               " + chalk.red("///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~") +
"\n                                                                  " + chalk.red("/.-~          ");

var WpUnderscoresGenerator = module.exports = function WpUnderscoresGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(WpUnderscoresGenerator, yeoman.generators.Base);

WpUnderscoresGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(hello);

  var prompts = [
  {
    name: 'themename',
    message: 'What is the name of your theme?',
    default: 'My Theme'
  },
  {
    name: 'themeuri',
    message: 'What is the URL of your theme?',
    default: 'http://underscores.me'
  },
  {
    name: 'author',
    message: 'What is your name?',
    default: 'Automattic'
  },
  {
    name: 'authoruri',
    message: 'What is your URL?',
    default: 'http://automattic.com/'
  },
  {
    name: 'themedescription',
    message: 'Enter the theme description:',
    default: 'A starter theme based on _s'
  },
  {
    type: 'confirm',
    name: 'sassBootstrap',
    message: 'Would you like to include sass-bootstrap?',
    default: false
  }
  ];

  this.prompt(prompts, function (props) {
    this.themename = props.themename;
    this.themeuri = props.themeuri;
    this.author = props.author;
    this.authoruri = props.authoruri;
    this.themedescription = props.themedescription;
    this.sassBootstrap = props.sassBootstrap;
    cb();
  }.bind(this));
};

WpUnderscoresGenerator.prototype.installunderscores = function installunderscores() {
  this.startertheme = 'https://github.com/Automattic/_s/archive/master.tar.gz';
  this.log.info('Downloading & extracting ' + chalk.yellow('_s'));
  this.tarball(this.startertheme, '.', this.async());
};

function findandreplace(dir) {
  var self = this;
  var _ = this._;

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);

    if (stat.isFile() && (path.extname(file) == '.php' || path.extname(file) == '.css')) {
      self.log.info('Find and replace _s in ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result;
      result = data.replace(/Text Domain: _s/g, "Text Domain: " + _.slugify(self.themename) + "");
      result = result.replace(/'_s'/g, "'" + _.slugify(self.themename) + "'");
      result = result.replace(/_s_/g, _.underscored(_.slugify(self.themename)) + "_");
      result = result.replace(/ _s/g, " " + self.themename);
      result = result.replace(/_s-/g, _.slugify(self.themename) + "-");
      if (file == 'style.css') {
        self.log.info('Updating theme information in ' + file);
        result = result.replace(/(Theme Name: )(.+)/g, '$1' + self.themename);
        result = result.replace(/(Theme URI: )(.+)/g, '$1' + self.themeuri);
        result = result.replace(/(Author: )(.+)/g, '$1' + self.author);
        result = result.replace(/(Author URI: )(.+)/g, '$1' + self.authoruri);
        result = result.replace(/(Description: )(.+)/g, '$1' + self.themedescription);
        result = result.replace(/(Version: )(.+)/g, '$10.0.1');
        result = result.replace(/(\*\/\n)/, '$1@import url("css/main.css");');
      }
      else if (file == 'footer.php') {
        self.log.info('Updating theme information in ' + file);
        result = result.replace(/http:\/\/automattic.com\//g, self.authoruri);
        result = result.replace(/Automattic/g, self.author);
      }
      else if (file == 'functions.php') {
        self.log.info('Updating theme information in ' + file);
        var themejs = "$1  wp_enqueue_script( '" + _.slugify(self.themename) + "-theme', get_template_directory_uri() . '/js/theme.js', array('jquery'), '0.0.1' );\n  if (in_array($_SERVER['SERVER_ADDR'], array('127.0.0.1', '192.168.50.4')) || pathinfo($_SERVER['SERVER_NAME'], PATHINFO_EXTENSION) == 'dev') {\n    wp_enqueue_script( 'livereload', '//localhost:35729/livereload.js', '', false, true );\n  }\n $2"
        result = result.replace(/(get_stylesheet_uri\(\) \);\n)(\n.wp_enqueue_script\()/, themejs);
      }
      fs.writeFileSync(file, result, 'utf8');
    }
    else if (stat.isFile() && path.basename(file) == '_s.pot') {
      self.log.info('Renaming language file ' + chalk.yellow(file));
      fs.renameSync(file, path.join(path.dirname(file), _.slugify(self.themename) + '.pot'));
    }
    else if (stat.isFile() && path.basename(file) == 'README.md') {
      self.log.info('Updating ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result = data.replace(/((.|\n)*)Getting Started(.|\n)*/i, '$1');
      fs.writeFileSync(file, result, 'utf8');
    }
    else if (stat.isDirectory()) {
      findandreplace.call(self, file);
    }
  });
}

WpUnderscoresGenerator.prototype.renameunderscores = function renameunderscores() {
  findandreplace.call(this, '.');
  this.log.ok('Done replacing string ' + chalk.yellow('_s'));
};

WpUnderscoresGenerator.prototype.addfiles = function addfiles() {
  this.log(chalk.yellow('Creating dev folders and files'));
  this.mkdir('images');
  this.mkdir('fonts');
  this.mkdir('css');
  this.mkdir('css/sass');
  this.copy('_main.scss', 'css/sass/main.scss');
  this.mkdir('js/vendor');
  this.copy('_theme.js', 'js/theme.js');
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('Gruntfile.js');
  this.copy('_gitignore', '.gitignore');
};

WpUnderscoresGenerator.prototype.sassboostrap = function sassboostrap() {
  if (this.sassBootstrap) {
    this.bowerInstall([ 'sass-bootstrap' ], { save: true });
  }
};
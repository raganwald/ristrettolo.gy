ristrettolo.gy
==============

This is the source code for the site [ristrettolo.gy]. It's a static site hosted on [Github Pages] that is built with [Jekyll]. Because it uses a custom plugin--the Jekyll Asset Pipeline--to transpile CoffeeScript into JavaScript, building the site is a little more involved than a typical Jekyll-on-Github-Pages site.

[ristrettolo.gy]: http://ristrettolo.gy
[Jekyll]: https://github.com/mojombo/jekyll
[Github Pages]: http://pages.github.com

I'm assuming that you want to try it for either of two reasons:

1. You're nice enough to have noticed a bug, typo, or potential improvement and want to send a pull request, or;
2. You're copying the setup for your own site.

Either way, here's how it works:

background reading
------------------

* [Github Pages Help](https://help.github.com/categories/20/articles)
* [Using Jekyll with Github Pages](https://help.github.com/articles/using-jekyll-with-pages)
* [Jekyll + Plugins + Github + You](http://charliepark.org/jekyll-with-plugins/)

In a nutshell, Github Pages publishes your static site by running it through Jekyll. Since every html page is a valid Jekyll page, Github Pages looks just like a static web server. But if you set up your repo to take advantage of Jekyll's features like [Liquid Templates], Github Pages will do the processing on the server side when you push to the server.

[Liquid Templates]: http://liquidmarkup.org

This means that any local use of Jekyll doesn't actually affect what's served from Github, it's just for your own preview and testing purposes. This matters greatly, because Github Pages is always in `safe` mode, meaning that it will not run plugins, at all.

Meaning, it will not convert CoffeeScript using the asset pipeline plugin or the CoffeeScript conversion plugin. Thus, we work around it.

setup
-----

Clone this repo to your local system. You will also need Ruby, and [Bundler] and you're going to run `bundle install`. Or, you're going to use `gem install` for each of the gems in the Gemfile.

[Bundler]: http://gembundler.com

If you wish to make changes and/or send me a pull request, you can stop right here. Run `jekyll` to process the site locally. Run `jekyll --auto` to automagically process the site when you edit things locally. Run `jekyll --server 3210` to run a local server on your favourite port, like `3210`.

pushing to github pages
-----------------------

Now if you're using this for yourself, you need to have a *separate* repository set up for Github Pages. You can't use this one! In my case, it's https://ristrettolo-gy/ristrettolo-gy.github.com. We'll call the original repository the `source` repo and we'll call the new one the `published` repo.

When you're happy with the `source` repo, you'll need to copy all of the files (recursively!) from `source/_site` into `published/`. `assets`, `index.html`, `CNAME`, the whole shebang. Then you'll need to commit and push. It's now a static site with no plugins, and Github Pages will publish it nicely for you.

You're a programmer, so you're probably already googling for a bash script to do it for you (why create when you can sit back and consume copypasta?) Here's my exact `~/.bash_profile` entries, snarfed as-is from [Jekyll + Plugins + Github + You](http://charliepark.org/jekyll-with-plugins/):

```bash
alias build_blog="cd ~/Dropbox/sites/ristrettolo.gy.raw; jekyll;cp -r ~/Dropbox/sites/ristrettolo.gy.raw/_site/* ~/Dropbox/sites/ristrettolo-gy.github.com;cd ~/Dropbox/sites/ristrettolo-gy.github.com;git add .;git commit -am 'Latest build.';git push"
alias bb="build_blog"
```

That's it!
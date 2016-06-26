[![Build Status](https://travis-ci.org/chrisallenlane/wit-cms.svg)](https://travis-ci.org/chrisallenlane/wit-cms)
[![npm](https://img.shields.io/npm/v/wit-cms.svg)]()
[![npm](https://img.shields.io/npm/dt/wit-cms.svg)]()
[![Known Vulnerabilities](https://snyk.io/test/npm/wit-cms/badge.svg)](https://snyk.io/test/npm/wit-cms)


wit
===
`wit` is a flat-file, "blog aware", publishing platform for [Express][]. It's
designed for those who want WordPress-like functionality without the heft and
attack-surface of a WordPress installation. It emphasizes simplicity,
security, and performance.

Overview
--------
Page and post content is declared by creating markdown files within the
appropriate directories. `wit` will generate everything else automatically,
including:

- express routes (both sync and async)
- "pages" and "posts" (with "read more" links and pagination)
- "tag" and "category" taxonomies
- blog search and archive
- a `sitemap.xml`
- an RSS feed

On application start, `wit` loads all site content into an in-memory object,
making it possible to serve content without reading a disk. This makes it
faster than traditional database-backed content-management systems.

`wit` seeks to offer a compromise between the full-featuredness of WordPress
and the ultra-minimalism of [Jekyll][], and strives to be a viable alternative
to those who may be dissatisfied with either.


Quick Start
-----------
To install only the `wit` module, run:

`npm install wit-cms`

To spare yourself the tedium of having to write boilerplate templating,
however, it may be preferable to clone the `wit-bootstrap` repository and
modify from there. This is the recommended approach for using `wit`:

https://github.com/chrisallenlane/wit-bootstrap


Creating Content
----------------
In order to create a "post" (a blog entry) or a "page" (content that exists
outside of the blog context), simply create a markdown file of the appropriate
name, and in the appropriate location. By default, markdown files that source
page content live in `<webroot>/pages/`, and markdown files that source blog
posts live in `<webroot>/posts/`.

Page and post urls will be generated based off of the filename of the
corresponding markdown file. For example, the source markdown for a "Hello
World" blog post should be saved to `<webroot>/posts/hello-world.md`, and its
URL would be `/blog/post/hello-world`.


Front-matter
------------
As with Jekyll, `wit` reads page and post metadata (title, date, author,
categories, tags, etc.) out of front-matter embedded within each post or page
via the [json-front-matter][] module.

For example, all posts should contain a header like the following:

```javascript
{{{
"title"       : "Hello World (of node blogging)",
"description" : "The post description."
"author"      : "John Doe",
"categories"  : [ "node", "blogging" ],
"tags"        : [ "javascript", "express" ],
"date"        : "2012-09-15"
}}}
```
Pages will have a similar, but sparser, header: 

```javascript
{{{
"title"       : "About Me",
"author"      : "John Doe"
"description" : "The page description."
}}}
```

All properties specified in front-matter will be made available to the
corresponding rendered views as page locals. 


Routes
------
`wit` automatically generates the following routes:

### Synchronous ###

- `/:page`
- `/blog/`
- `/blog/post/:name`
- `/blog/category/:category`
- `/blog/tag/:tag`
- `/blog/archive/:year/:month?/:day?`
- `/blog/search`
- `/feed`
- `/sitemap.xml`

### Asynchronous ###

- `/async/pages`
- `/async/pages/:page`
- `/async/blog/`
- `/async/blog/post/:name`
- `/async/blog/category/:category`
- `/async/blog/tag/:tag`
- `/async/blog/archive/:year/:month?/:day?`
- `/async/blog/search`
- `/async/tags`
- `/async/categories`
- `/async/params`

(The asyncronous routes return JSON responses.)

Objects
-------
`wit` buffers all site content in a `wit` object. Here is an example of its
structure:

```javascript
wit {
  pages: {
    "about"     : aPageObject,
    "contact"   : aPageObject,
    "portfolio" : aPageObject,
  },

  posts: {
    "website-redesign" : aPostObject,
    "blogging-in-node" : aPostObject,
    "wit-vs-wordpress" : aPostObject,
  },

  tags: [
    'the-first-tag',
    'the-second-tag',
    'the-third-tag',
    'etc',
  ],

  categories: [
    'the-first-category',
    'the-second-category',
    'the-third-category',
    'etc',
  ],

  params: {
    // arbitrary params specified on initialization
  },

}
```

Whereby a post object takes the following shape:

```javascript
 {
  title      : 'The Post Name',
  name       : 'the-post-name',
  url        : '/blog/post/the-post-name',
  author     : 'John Doe',
  categories : [ 'foo', 'bar' ],
  tags       : [ 'alpha', 'bravo', 'charlie' ],
  date: {
    datetime : '2012-09-12T00:00:00-04:00',
    day      : '02',
    month    : '04',
    pretty   : '2 April 2014', // configurable
    unix     : '1396411200',
    year     : '2014',
  content: '<p>The page content.</p>',
}
```

And a page object takes the following shape:

```javascript
 {
  title       : 'The Page Name',
  name        : 'the-page-name',
  url         : '/the-page-name',
  author      : 'John Doe',
  description : 'A descripton for the page.',
  content     : '<p>The full page content.</p>'
}
```


Initializing
------------
The `wit-cms` module will export a single function that will decorate an
initialized Express app. Upon invokation, the function will also return a `wit`
object that contains the entirety of the wit data.

```javascript
const express = require('express');
const path    = require('path');
const Wit     = require('wit-cms');
var app       = express();

// express configs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// wit configs
var config = {

  // template params
  params: {
    author  : 'John Doe',
    fqdn    : 'https://example.com',
    name    : 'Example Website',
    tagLine : 'An example site made using wit-cms',
  },
  
};

Wit(app, config, function(err, wit) {

  // continue building the express app here as desired

});
```

Note that arbitrary properties may be attached to `config.params`.  These
properties will be made available to page templates via the returned `wit`
object as `wit.params`.


Searching
---------
`wit` provides for searching among blog posts via the [`lunr`][lunr] module.


Commenting
----------
Because `wit` stores its content in flat files instead of a database, it does
not and can not natively support a reader commeting system. If you'd like to
enable commenting on your blog, consider using [Disqus][] or [`isso`][isso].


Security
--------
`wit` neither implements administrative access controls, nor requires a
database back-end. As such, it is immune to many classes of attacks to which
other content-management systems may be vulnerable.

It is not "hack proof", however. Its attack-surface consists (at least) of:

1. Inputs that write to the DOM (search boxes, URLs, etc.)
2. The attack-surface of Express
3. The attack-surface of nodejs

As a defense against [Cross-Site Scripting attacks][xss-owasp], `wit`
internally relies on the [`xss`][xss] module to sanitize user inputs that may
be written back to the DOM.  Regardless, it is still prudent to use a
templating engine (`ejs`, `hogan`, etc.) when authoring views.

Lastly - though this should go without saying - the `node` application should
never be run as `root`.


License
-------
`wit` is released under the MIT license. See `LICENSE.txt` for details. 

[Disqus]:            http://disqus.com/
[Express]:           http://expressjs.com/
[Jekyll]:            http://jekyllrb.com/
[isso]:              https://github.com/posativ/isso
[json-front-matter]: https://www.npmjs.org/package/json-front-matter
[lunr]:              https://www.npmjs.com/package/lunr
[xss-owasp]:         https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)
[xss]:               https://www.npmjs.com/package/xss

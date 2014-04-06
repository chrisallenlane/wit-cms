wit
===
`wit` is a flat-file "blog aware" publishing platform for [Express][]. It's
designed for those who want WordPress-like functionality without the heft (and
attack surface) of a WordPress installation. It emphasizes simplicity,
security, and performance.


Overview
--------
Page and post content is declared by creating markdown files within the
appropriate directories. `wit` will generate everything else automatically,
including:

- routes
- "pages" and "posts"
- tag, category, and archive taxonomies
- canonical URLs 
- `sitemap.xml`
- an RSS feed
- "read more" links and pagination

On application start, `wit` loads all site content into an in-memory object,
making it possible to serve content without reading from disk. This makes it
rather performant when compared to database-backed content-management systems.

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
page content live in `<app root>/pages/`, and markdown files that source blog
posts live in `<app root>/posts/`.

Page and post urls will be generated based off of the filename of the
corresponding markdown file. For example, the source markdown for a "Hello
World" blog post should be saved to `<app root>/posts/hello-world.md`, and it's
URL would be `/blog/post/hello-world`.


Front-matter
------------
As with Jekyll, `wit` reads page and post metadata (title, date, author,
categories, tags, etc) out of front-matter embedded within each post or page
via the [json-front-matter][] module.

For example, all posts should contain a header like the following:

```javascript
{{{
"title"      : "Hello World (of node blogging)",
"author"     : "Chris Allen Lane",
"categories" : ["node", "blogging"],
"tags"       : ["javascript", "express"],
"date"       : "2012-09-15"
}}}
```
Pages will have a similar, but sparser, header: 

```javascript
{{{
"title"      : "About Me",
"author"     : "Chris Allen Lane"
}}}
```
All properties specified in front-matter will be made available to the
corresponding rendered views as page locals. 


Routes
------
`wit` automatically generates the following routes:

- `/:pageName`
- `/blog`
- `/blog/post/:postName`
- `/blog/category/:postName`
- `/blog/tag/:postName`
- `/blog/archive/`
- `/blog/archive/:year`
- `/blog/archive/:year/:month`
- `/blog/archive/:year/:month/:day`


Objects
-------
`wit` buffers all site content in a `wit` object on app init, which is
structured as follows:

```javascript
wit {
  pages      : { /* pages */ },
  posts      : { /* posts */ },
  archive    : { /* posts */ },
  tags       : { /* posts */ },
  categories : { /* posts */ },
}
```

For example: 

```javascript
wit {
  pages: {
    about     : aPageObject,
    contact   : aPageObject,
    portfolio : aPageObject,
  },

  posts: {
    website-redesign : aPostObject,
    blogging-in-node : aPostObject,
    wit-vs-wordpress : aPostObject,
  },

  archive: {
    2013: {
      12: {
        31: {
          website-redesign : aPostObject,
        }
      }
    }
    2014: {
      01: {
        07: {
          blogging-in-node : aPostObject,
        }
        14: {
          wit-vs-wordpress : aPostObject,
        }
      }
    }
  },

  tags: {
    meta: {
      website-redesign : aPostObject,
    }
    express: {
      blogging-in-node : aPostObject,
      wit-vs-wordpress : aPostObject,
    }
  },

  categories: {
    announcements: {
      website-redesign : aPostObject,
    }
    node: {
      blogging-in-node : aPostObject,
      wit-vs-wordpress : aPostObject,
    }
  }
}
```

Whereby a post object takes the following shape:

```javascript
post: {
  title   : 'The Post Name',
  name    : 'the-post-name',
  url     : '/blog/post/the-post-name',
  content : '<p>Rendered markdown content.</p>',
  date    : {
    datetime : '',
    day      : '02',
    month    : '04',
    pretty   : '02 April 2014',
    unix     : '',
    year     : '2014',
  },
}

```

And a page object takes the following shape:

```javascript
page: {
  title   : 'The Page Name',
  name    : 'the-page-name',
  url     : '/the-page-name',
  content : '<p>Rendered markdown content.</p>',
}

```


Initializing
------------
`wit` only implements one method - `init()` - which is used to initialize the
application. It may be configured and invoked thusly:

```javascript

// ...

var config = {
  // site configs
  site: {
    author  : 'John Doe',
    fqdn    : 'https://example.com',
    name    : 'The Example.com Blog',
    tagLine : 'An exemplary blog.',
  },
  
  // page configs
  pages: {
    // this is the directory from which "page" markdown will be read
    dir: './pages/', 
  },

  // post configs
  posts: {
    // this is the directory from which "page" markdown will be read
    dir      : './posts/',

    // knobs regarding auto-excerpting. Excerpts are generating automatically
    // if a post does not contain a "<!--more-->" tag (per the Wordpress
    //  convention).
    excerpt  : {
      length : 1,

      // units may be "paragraphs" or "words"
      units  : 'paragraphs',
    },

    perPage : 5,
  },
};

// init the app
wit.init(app, config, function(err, wit) {
  // You may continue to modify the express app here before the server starts
}

// ...

```


Searching
---------
`wit` does not currently provide an in-built solution for searching through
site content, though it would be capable of doing so with some work. (This is
something that I would like to implement in the future, time-permitting.)

Until that capability is implemented natively, however, you may consider using
a [Google Custom Search Engine][gcse] instead.


Security
--------
`wit` neither implements administrative access controls, nor requires a
database back-end. As such, it is immune to many classes of attacks to which
other content-management systems may be vulnerable.

It is not "hack proof", however. Its attack-surface consists (at least) of:

1. Inputs that write to the DOM (search boxes, URLs, etc).
2. The attack-surface of nodejs itself.

With that said, it is important to use a templating engine (ejs, hogan, etc.)
when authoring views. Likewise - though this should go without saying - the
`node` application should never be run as `root`.


Known Issues
------------
- Due to the way `wit` loads content, page and post names must be unique. I
  don't anticipate that this will cause problems for most users, and thus am
  not planning on addressing this issue at this time.

- Unit tests are currently a bit of a farce. I do plan to remedy this in the
  future as time permits.


Contributing
------------
If you'd like to contribute to `wit`, please fork its Github repository, make
your changes, and submit a pull-request.

Please note that one of `wit`'s primary advantages is its simplicity and small
codebase, so I am not interested in bloating it with "features". With that
said, you may wish to contact me before you make modifications if you're
interested in seeing your changes merged upstream.

Bug fixes will always be accepted.


Testing
-------
To run the linter and `wit`'s unit tests (sparse as they are), simply run
`grunt`.


License
-------
`wit` is released under the MIT license. See `LICENSE.txt` for details. 


[Express]:           http://expressjs.com/
[Jekyll]:            http://jekyllrb.com/
[gcse]:              https://www.google.com/cse/
[json-front-matter]: https://www.npmjs.org/package/json-front-matter
[marked]:            https://www.npmjs.org/package/marked

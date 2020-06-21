> React template with SSR by using Firebase Cloud Functions


<p align="center">
    <img src="demo.png" />
</p>
<p align="center">
    <a href="https://github.com/Ridermansb/react-firebase-ssr/actions?query=workflow%3Adeploy">
        <img src="https://github.com/Ridermansb/react-firebase-ssr/workflows/deploy/badge.svg" alt="">
    </a>
</p>

### Pre-requisites

Make sure you have [`firebase-tools`][firebase-tools] installed

**Install all dependencies**
```
npm i
cd functions/ 
npm i
```

## Get Starter

`npm start` will start webpack-dev-server on port 7003


### Run with firebase server

Build the app to generate `client.html`

```
rm -rf public && PUBLIC_PATH=http://0.0.0.0:5000 NODE_ENV=production npmR build -- --watch
```

> PUBLIC_PATH is the hosting URL generated by firebase server

Inside `functions` folder, run webpack in watch mode

```
rm -rf dist/ && NODE_ENV=production npmR build -- --watch 
```

Start the server

```
npmR start:serve -- --host 0.0.0.0
```

### Run with firebase emulators

Build the app to generate `client.html`

```
rm -rf public && PUBLIC_PATH=http://0.0.0.0:8000 NODE_ENV=production npmR build -- --watch
```

> PUBLIC_PATH is the hosting URL, check firebase.json file

Inside `functions` folder, run webpack in watch mode

```
rm -rf dist/ && NODE_ENV=production npmR build -- --watch 
```

Start the emulators

```
npmR start:emulators
```

---------

## Tools

### Performance

 * > [prerender.io][4]   
   > Allows your Javascript website to be crawled perfectly by search engines.
 * > [react-snap][5]
   > Pre-renders a web app into static HTML. Uses Headless Chrome to crawl all available links starting from the root.
 * > [pagespeed][pagespeed]
   > Test your page in all devices

### Great tools for SEO

 * [schema-markup-generator][1] or [json-ld-generator][json-ld-generator]
 * [seositecheckup.com][seositecheckup]
 * [rich-results][rich-results] or [structured-data][structured-data]
 * [facebook-og-debug][facebook-og-debug]
 * [linkedin-post-inspector][linkedin-post-inspector]
 * [twitter-card-validator][twitter-card-validator]
 * [smallseotools][smallseotools]


### Other tools

 * [best-marketing-tools][best-marketing-tools]
 * [search-console][search-console]

[1]: https://technicalseo.com/tools/schema-markup-generator/
[json-ld-generator]: https://webcode.tools/json-ld-generator
[best-marketing-tools]: https://saijogeorge.com/best-marketing-tools/
[4]: https://prerender.io/
[5]: https://github.com/stereobooster/react-snap
[firebase-tools]: https://firebase.google.com/docs/cli
[search-console]: https://search.google.com/search-console
[seositecheckup]: https://seositecheckup.com/
[pagespeed]: https://developers.google.com/speed/pagespeed/insights/
[rich-results]: https://search.google.com/test/rich-results?utm_campaign=devsite&utm_medium=jsonld&utm_source=recipe
[structured-data]: https://search.google.com/structured-data/testing-tool
[facebook-og-debug]: https://developers.facebook.com/tools/debug/
[smallseotools]: https://smallseotools.com/
[linkedin-post-inspector]: https://www.linkedin.com/post-inspector/
[twitter-card-validator]: https://cards-dev.twitter.com/validator
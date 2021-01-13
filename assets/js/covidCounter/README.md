# covid counter (a.k.a. library capacity counter)

You can find most information about our covid counter and its plugin in their official repos:

* [covid counter](https://github.com/ualibweb/covid-counter/)
* [covid counter plugin](https://github.com/ualibweb/covid-counter-plugin/)

## how to update

What isn't covered in the repos is how to get updated code into our theme. Here you go!

1. in your `covid-counter` directory, spin up your dev environment with `npm run dev` as explained in the covid counter repo
2. it might be hard to check your changes locally since we locked down the API to only work for logged-in users, but all the logic should still work. updating capacity numbers for the homepage counter should be reflected here, but incrementing/decrementing probably won't work.
3. when you're satisfied, stop the dev build, and switch to `npm run build` this will output a file into your build directory called `build.js` (among others)
4. copy this file into the roots theme here: `assets/js/covidCounter/dev/covidCounter.js`
5. delete the previous `covidCounter.js` and rename the file you just coped to match the filepath above
6. in `roots-ualib`, run `grunt live-build` to make sure you get it built for prod, too
7. push away!

I wrote this for myself because a lot of time had passed between working on this project and needing to update the capacity for Gorgas, and I hope by the time I need to switch it back in 6-8 weeks, I can refine any instructions here that don't make sense. :+1:

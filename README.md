# futel-usage-viz
Some graphs showing [futel usage data](https://breedx2.github.io/futel-usage-viz/static/)

# usage

Right now, it's just a bunch of static html/css/js...but you have to
run a webserver to handle the js fetch calls.

With node:
```
npm install
npm run server
```
and point a browser at http://localhost:8080/

With python:
```
cd static
python3 -m http.server
```
and point a browser at http://localhost:8000

# data prep

When the data changes, we need to run a tool to pre-aggregate this data.

```
node --experimental-json-modules src/data-prep.js -i metrics.tgz -o outdir
```
(the experimental bit is there to allow importing json files)

TODO: Show usage and make me more helpful!


# notes

* don't push raw metrics files that have not been scrubbed.  
* very stupid scrubbing:
```
cat some-metrics-file.txt | \
    sed -e "s/ CALLERID(number)=.[[:digit:]]\+, /, CALLERID(number)=0000000000, /" | \
    grep -ve 'CHANNEL=SIP/67[0-4]-' | \
    grep -ve 'CHANNEL=SIP/61[0-4]-'
```

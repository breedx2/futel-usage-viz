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

The data for these graphs lives as static json files that are preprocessed
from the original raw log data.

When the data changes, we need to run a tool to pre-aggregate this data.  
Our tool reads from a `.tgz` file and outputs to an output director.

```
node --experimental-json-modules src/data-prep.js -i metrics.tgz -o outdir
```
(the experimental bit is there to allow importing json files)

or more simply, if you:
* have metrics.tgz in the project dir
* want to output to the `static/data` dir *and*
* don't mind overwriting files `static/data`

then you can simply:
```
npm run preprocess
```

The process takes just a few seconds.  Once the data has been updated, it should
be committed to the git repo.

## event name mappings

Event names have been inconsistent over time, which is fine, but we have a way
of dealing with it.

If you encounter an event that needs normalization, please submit a PR against
the `src/event-name-mappings.json` file.

# saving graphs / making a pdf

Because the [graphing library](https://www.chartjs.org/) paints on an html
`<canvas>`, the graphs are easily saved.  Simply right-click the graph and choose
"Save image as..." from the popup menu.

If you want to make a PDF that contains these graphs, paste them into google
docs and then export the final doc as PDF.

# notes

* don't push raw metrics files that have not been scrubbed.  
* very stupid scrubbing:
```
cat some-metrics-file.txt | \
    sed -e "s/ CALLERID(number)=.[[:digit:]]\+, /, CALLERID(number)=0000000000, /" | \
    grep -ve 'CHANNEL=SIP/67[0-4]-' | \
    grep -ve 'CHANNEL=SIP/61[0-4]-'
```

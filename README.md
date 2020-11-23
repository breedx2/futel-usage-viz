# futel-usage-viz
Some graphs showing usage data

# usage

Right now, it's just a bunch of static html/css/js...but you have to
run a webserver to handle the js fetch calls.

With node:
```
npm install
npm run app
```
and point a browser at http://localhost:8080/

With python:
```
cd static
python3 -m http.server
```
and point a browser at http://localhost:8000

# notes

* don't push raw metrics files that have not been scrubbed.  
* very stupid scrubbing:
```
cat static/metrics-20201030 | \
    sed -e "s/ CALLERID(number)=.[[:digit:]]\+, /, CALLERID(number)=0000000000, /"
```

StoryCast
=========

This project grew out of the need to demonstrate features to a large base of stakeholders
on an ongoing basis when the production environments were not yet up and preparing for
demos was seriously impeding forward progress.

The idea of this project is to allow the convenient sharing of screencasts of newly implemented
features (and bugs!) and allowing the screencasts to be linked to user stories and specific
URLs within a web app.

It's early days yet so expect some issues.

License
-------

This is use-at-your-own-risk-ware.

Setup
-----

Assuming you set the database connection stuff correctly (woohoo I've published my passwords...)
and simply import the SQL file to your database server, it should work out of the box (it generates
passwords for you given an email address).

You need to create an uploads directory with appropriate permissions and that's about it.

Dependencies
------------

I used this fine md5 implementation: http://www.myersdaily.org/joseph/javascript/md5-text.html

I definitely drank too much coffee today -- jq.js represents my building my own jQuery replacement
over the course of the day. It's kind of nutty but it does what I need (and it includes a nifty
lightweight binding system -- see the values and table methods). I've actually got a much nicer
binding library up my sleeve, but the licensing is in flux.

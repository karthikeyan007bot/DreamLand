"use strict";

var mongoose = require('mongoose');

var report_user = new mongoose.Schema({
  report: String,
  detail: String,
  reported_user: String,
  reporting_user: String
});
mongoose.model('Report', report_user);
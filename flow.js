/* Screen-to-screen navigation for the prototype.
   Loaded from each screen's <helmet>. Handlers call go('review') etc., so
   re-pointing the demo spine is an edit to this file rather than a hunt
   through eleven screens. */
window.FLOW = {
  login:         'LoginScreen.dc.html',
  register:      'RegisterScreen.dc.html',
  otp:           'OtpScreen.dc.html',
  home:          'HomeScreen.dc.html',
  project:       'ProjectDetailScreen.dc.html',
  newProject:    'CreateProjectScreen.dc.html',
  schedule:      'ScheduleScreen.dc.html',
  profile:       'ProfileScreen.dc.html',
  help:          'HelpScreen.dc.html',
  scan:          'ScanScreen.dc.html',
  processing:    'ProcessingScreen.dc.html',
  review:        'ReviewScreen.dc.html',
  export:        'ExportScreen.dc.html',
};

window.go = function (key) {
  var target = window.FLOW[key];
  if (!target) { console.warn('[flow] unknown screen:', key); return; }
  location.href = target;
};

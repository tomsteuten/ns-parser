(function () {
  // Simple log to confirm script loaded
  console.log("NS Parser bookmarklet.js loaded");

  function g(sel) {
    return document.querySelector(sel);
  }

  var d = {
    site: "",
    address: "",
    caseNum: "",
    caseType: "",
    caseDetails: "",
    description: "",
    taskNum: "",
    taskType: "",
    woNum: "",
    issuedDate: "",
    completeDue: "",
    scheduledWindow: "",
    equipment: ""
  };

  var site = g('[data-testid="taskdetail-label"]');
  if (site && site.innerText) d.site = site.innerText.trim();

  var sub = g('[data-testid="taskdetail-sublabel"]');
  if (sub && sub.innerText) {
    var s = sub.innerText.trim();
    var m = s.match(/\((\d+)\)/);
    if (m) d.taskNum = m[1];
    d.taskType = s.split("(")[0].trim();
    var parts = s.split(":");
    if (parts.length > 1) {
      d.address = parts.slice(1).join(":").trim();
    }
  }

  document.querySelectorAll('[data-testid="taskdetail-description"] p')
    .forEach(function (p) {
      var t = (p.innerText || "").trim();
      if (!t) return;
      if (t.indexOf("Case Number") !== -1) d.caseNum = t.split(":")[1]?.trim() || "";
      if (t.indexOf("Case Type") !== -1) d.caseType = t.split(":")[1]?.trim() || "";
      if (t.indexOf("Task Number") !== -1) d.taskNum = t.split(":")[1]?.trim() || "";
      if (t.indexOf("Task Type") !== -1) d.taskType = t.split(":")[1]?.trim() || "";
      if (t.indexOf("Task Details") !== -1) d.description = t.split(":")[1]?.trim() || "";
      if (t.indexOf("WO #") !== -1) d.woNum = t.split(":")[1]?.trim() || "";
      if (t.indexOf("Date/Time Issued") !== -1) d.issuedDate = t.split(":")[1]?.trim() || "";
      if (t.indexOf("Complete OverDue Date") !== -1) d.completeDue = t.split(":")[1]?.trim() || "";
      if (t.indexOf("Case Details") !== -1) {
        var x = t.split(":")[1];
        if (x) d.caseDetails = x.trim();
      }
    });

  var loc = g('[data-testid="taskdetail-location"] div:last-child');
  if (loc && loc.innerText) d.address = loc.innerText.trim();

  document.querySelectorAll('[data-testid="taskdetail-tab-span"]').forEach(function (e) {
    var t = (e.innerText || "").trim();
    if (t.indexOf("Equipment") === 0) {
      d.equipment = t.replace("Equipment", "").trim();
    }
  });

  var dt = g('[data-testid="taskdetail-datetime"] div');
  if (dt && dt.innerText) d.scheduledWindow = dt.innerText.trim();

  var meaningful =
    d.caseNum || d.taskNum || d.site || d.woNum || d.address;

  if (!meaningful) {
    alert("NS Parser: Could not detect a job. Make sure you have a Task Detail open.");
    return;
  }

  try {
    var encoded = encodeURIComponent(JSON.stringify(d));
    window.location.href = "https://tomsteuten.github.io/ns-parser/?d=" + encoded;
  } catch (err) {
    console.error("NS Parser bookmarklet error:", err);
    alert("NS Parser: Failed to serialise job data: " + err.message);
  }
})();

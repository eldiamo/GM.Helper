/**
 * GMHelper.Timer
 * 
 */

let GMHelper = {};

GMHelper.Timer = (function() {
  // ## private ##
  // values
  let starttime = -1;
  let worktime  = -1;
  let breaktime = -1;
  let endtime   = -1;

  // consts
  // all time values are values in minutes (60 * hours)
  const starttimeDefault     = 60 * 9;
  const minStarttime         = 60 * 7;
  const worktimeExtended     = 60 * 9;
  const worktimeDefault      = 60 * 8;
  const worktimeWithoutBreak = 60 * 6;
  const maxWorktime          = 60 * 10;
  const minBreaktimeDefault  = 30;
  const minBreaktimeExtended = 45;
  const maxBreaktime         = 60 * 3;
  const maxEndtime           = 60 * 19;
  // localStorage values
  const lsDay = "gm_timer_day";
  const lsStarttime = "gm_timer_starttime";
  const lsBreaktime = "gm_timer_breaktime";
  const lsWorktime = "gm_timer_worktime";
  const lsEndtime = "gm_timer_endtime";
  // text values
  const msg = {
    error: {
      timeString:   "Error: String for time must be 4 in length and represent hours and minutes (e.g. '2143' for 9:43 p.m. or '0830' for 8:30 a.m.).",
      breakMinMax:  "Error: Number for break in minutes must be 0-" + maxBreaktime + ".",
      localStorage: "Error: window.localStorage does not exist."
    },
    info: {
      initStarttime:        "Info: Initialisation starttime set to now.",
      initBreaktime:        "Info: Initialisation breaktime set to " + (minBreaktimeDefault) + " minutes.",
      initWorktime:         "Info: Initialisation worktime set to " + (worktimeDefault/60) + ":00.",
      minStarttime:         "Info: Min starttime must be " + (minStarttime/60) + ":00. Starttime value updated to min.",
      maxWorktime:          "Info: Max worktime is " + (maxWorktime/60) + ":00. Cut worktime down to max hours. And endtime is updated.",
      maxEndtime:           "Info: Max endtime must be " + (maxEndtime/60) + ":00. Endtime value updated to max. And worktime is updated.",
      defaultBreaktime:     "Info: Breaktime is set to default value (" + minBreaktimeDefault + "), when worktime is more than " + (worktimeWithoutBreak/60) + " hours.",
      extendedBreaktime:    "Info: Breaktime is set to extended value (" + minBreaktimeExtended + "), when worktime is more than " + (worktimeExtended/60) + " hours.",
      endBeforeStart:       "Info: Endtime cannot be before starttime dependend on breaktime. Endtime was not updated.",
      startAfterEnd:        "Info: Starttime cannot be after endtime dependend on breaktime. Starttime was not updated.",
      startAfterEndDefault: "Info: Starttime cannot be after endtime dependend on breaktime. Starttime was set to default " + (starttimeDefault/60) + ":00."
    }
  };
  // functions
  let string2HM = function(s) {
    return { hours: new Number(s.substring(0,2)),
             minutes: new Number(s.substring(2,4))
           };
  };
  let addZero = function(n) {
    return "" + (n > 9 ? n : '0' + n);
  };
  let isTimeStringOk = function(s) {
    if( s != undefined &&
        (typeof s == 'string' || s instanceof String) &&
        s.match(/[0-9]{4}/)) {
          let hm = string2HM(s);
          if(hm.hours < 24 && hm.hours >= 0 && hm.minutes < 60 && hm.minutes >= 0) {
            return true;
          }
        }
    return false;
  };
  let isNumberOk = function(v, max) {
    let n = Number(v);
    let s = String(v);
    if(s.match(/[0-9]{1,}/) && n % 1 === 0 && n >= 0 && n <= max) {
      return true;
    }
    return false;
  };
  let isNotInit = function() {
    return (starttime > -1 && breaktime > -1 && worktime > -1 && endtime > -1);
  };
  let isInit = function() {
    return !isNotInit();
  };
  let timeVal2String = function(t) {
    let h = Math.floor(t/60);
    let m = t%60;
    return '' + (h < 1 ? '00' : h > 9 ? h : '0' + h) +
                (m == 0 ? '00' : (m > 9 ? m : '0' + m));
  };
  let ifValidStringCallFn = function(fn, s) {
    if(isTimeStringOk(s)) {
      fn();
    } else {
      alert(msg.error.timeString);
    }
  };
  let string2TimeVal = function(s) {
    let timeVal = -1;
    let fn = function() {
      let hm = string2HM(s);
      timeVal = hm.hours * 60 + hm.minutes;
    };
    ifValidStringCallFn(fn, s);
    return timeVal;
  };
  let date2StringHM = function(date) {
    return '' + addZero(date.getHours()) + addZero(date.getMinutes());
  };
  let date2StringYMD = function(date) {
    return '' + date.getFullYear() + addZero(date.getMonth()+1) + addZero(date.getDate());
  };
  let fixStarttime = function(st) {
    if(isInit() && st >= maxEndtime - minBreaktimeDefault) {
      console.log(msg.info.startAfterEndDefault);
      starttime = starttimeDefault;
    } else if(isNotInit() && st >= endtime - breaktime) {
      console.log(msg.info.startAfterEnd);
      // do nothing
    } else if(isInit() && st < minStarttime) {
      // dont run fixEndtime on init here
      console.log(msg.info.minStarttime);
      starttime = minStarttime;
    } else if(isNotInit() && st < minStarttime) {
      console.log(msg.info.minStarttime);
      // and update endtime with delta
      let deltaTime = st - minStarttimest; // must me minus
      fixEndtime(endtime + deltaTime);
      starttime = minStarttime;
    } else {
      starttime = st;
    }
  };
  let fixBreaktime = function(bt) {
    if(isNotInit() && worktime > worktimeExtended && bt < minBreaktimeExtended) {
      console.log(msg.info.extendedBreaktime);
      // and update endtime with delta of break
      let deltaTime = bt - minBreaktimeExtended; // must be minus
      fixEndtime(endtime + deltaTime);
      breaktime = minBreaktimeExtended;
    } else if(isNotInit() && worktime > worktimeWithoutBreak && bt < minBreaktimeDefault) {
      console.log(msg.info.defaultBreaktime);
      // and update endtime with delta of break
      let deltaTime = bt - minBreaktimeDefault; // must be minus
      fixEndtime(endtime + deltaTime);
      breaktime = minBreaktimeDefault;
    } else {
      breaktime = bt;
    }
  };
  let fixWorktime = function(wt) {
    if(isNotInit() && wt > maxWorktime) {
      console.log(msg.info.maxWorktime);
      // and update endtime with delta
      let deltaTime = maxWorktime - wt; // must me minus
      fixEndtime(endtime + deltaTime);
      worktime = maxWorktime;
    } else {
      worktime = wt;
    }
    // breaktime depends on worktime and needs an update
    fixBreaktime(breaktime);
  };
  let fixEndtime = function(et) {
    if(isNotInit() && et <= starttime + breaktime) {
      console.log(msg.info.endBeforeStart);
      // do nothing
    } else if(et > maxEndtime) {
      // must not check if init because endtime init called after init worktime
      console.log(msg.info.maxEndtime);
      // and update worktime with delta
      let deltaTime = maxEndtime - et; // must be minus
      fixWorktime(worktime + deltaTime);
      endtime = maxEndtime;
    } else {
      endtime = et;
    }
  };
  let updateStarttime = function(st) {
    let fn = function() {
      fixStarttime(string2TimeVal(st));
    };
    ifValidStringCallFn(fn, st);
  };
  let updateBreaktime = function(bt) {
    if(isNumberOk(bt, maxBreaktime)) {
      fixBreaktime(bt);
    } else {
      alert(msg.error.breakMinMax)
    }
  };
  let updateWorktime = function(wt) {
    let fn = function() {
      fixWorktime(string2TimeVal(wt));
    };
    ifValidStringCallFn(fn, wt);
  };
  let updateEndtime = function(et) {
    let fn = function() {
      fixEndtime(string2TimeVal(et));
    };
    ifValidStringCallFn(fn, et);
  };
  let calcEndtime = function() {
    let calcEt = starttime + worktime + breaktime;
    fixEndtime(calcEt);
  };
  let calcWorktime = function() {
    let calcWt = endtime - breaktime - starttime;
    fixWorktime(calcWt);
  };
  let updateLocalStorage = function() {
    if(window.localStorage) {
      let day = localStorage.getItem(lsDay);
      let d = new Date();
      let today = date2StringYMD(d);
      if(day == null) {
        localStorage.setItem(lsDay, today);
      }
      if(day == today) {
        starttime = localStorage.getItem(lsStarttime);
        breaktime = localStorage.getItem(lsBreaktime);
        worktime = localStorage.getItem(lsWorktime);
        endtime = localStorage.getItem(lsEndtime);
      } else {
        localStorage.setItem(lsDay, today);
        localStorage.setItem(lsStarttime, starttime);
        localStorage.setItem(lsBreaktime, breaktime);
        localStorage.setItem(lsWorktime, worktime);
        localStorage.setItem(lsEndtime, endtime);
      }
    } else {
      console.log(msg.error.localStorage);
    }
  };
  let saveLocalStorageVal = function(v, localStorageVal) {
    if(window.localStorage) {
      localStorage.setItem(localStorageVal, v);
    } else {
      console.log(msg.error.localStorage);
    }
  };
  let saveLocalStorageAllVals = function() {
    if(window.localStorage) {
      localStorage.setItem(lsStarttime, starttime);
      localStorage.setItem(lsBreaktime, breaktime);
      localStorage.setItem(lsWorktime, worktime);
      localStorage.setItem(lsEndtime, endtime);
    }
  };
  // ## end of private ##
  return {
    // ## public ##
    // initialisation of a timer object to handle times of a workday
    init: function(st, bt, wt) {
      if(!isTimeStringOk(st)) {
        let date = new Date();
        st = date2StringHM(date);
        console.log(msg.info.initStarttime);
      }
      if(!isNumberOk(bt, maxBreaktime)) {
        bt = minBreaktimeDefault;
        console.log(msg.info.initBreaktime);
      }
      if(!isTimeStringOk(wt)) {
        wt = timeVal2String(worktimeDefault);
        console.log(msg.info.initWorktime);
      }
      updateStarttime(st);
      updateBreaktime(bt);
      updateWorktime(wt);
      calcEndtime();
      updateLocalStorage();
    },
    // validate starttime and set new value
    setStarttime: function(st) {
      updateStarttime(st);
      calcWorktime();
      calcEndtime();
      saveLocalStorageAllVals();
    },
    // get starttime for view
    getStarttime: function() {
      return timeVal2String(starttime);
    },
    // validate breaktime and set new value
    setBreaktime: function(bt) {
      updateBreaktime(bt);
      calcWorktime();
      saveLocalStorageAllVals();
    },
    // get breaktime for view
    getBreaktime: function() {
      return timeVal2String(breaktime);
    },
    // validate worktime and set new value
    setWorktime: function(wt) {
      updateWorktime(wt);
      calcEndtime();
      saveLocalStorageAllVals();
    },
    // get worktime for view
    getWorktime: function() {
      return timeVal2String(worktime);
    },
    // validate endtime and set new value
    setEndtime: function(et) {
      updateEndtime(et);
      calcWorktime();
      saveLocalStorageAllVals();
    },
    // get endtime for view
    getEndtime: function() {
      return timeVal2String(endtime);
    }
  }; // ## end of public (return) ##
})();

(function(){
  'use strict';

angular.module('gitInsight.dateFormat', [])
  .factory('dateFormat', dateFormat);

dateFormat.$inject = [];

function dateFormat () {
  return {
    ymdFormat: ymdFormat,
    dayRange: dayRange,
    processContributionData: processContributionData,
    determineLastMonth: determineLastMonth,
    contribsPerDay: contribsPerDay
  };

  function ymdFormat (ymdDate) {
    // "2014-12-10"
    // ['2014', '12', '10'];
    // {year: 2014, month: 12, day: 10};
    var slicedDate = ymdDate.slice(0,10);
    var splitDate = slicedDate.split('-');
    var finalDate = {
      year: splitDate[0],
      month: splitDate[1],
      day: splitDate[2]
    };

    return finalDate;
  };

  function dayRange (startDate, endDate) {
    // {year: 2014, month: 12, day: 10};
    // {year: 2015, month: 02, day: 14};
    // year difference * 365 ==> 365
    // month difference * 30.5 ==> -305
    // day difference == 4
    // 64 days -ish
    var yearDiff = endDate.year - startDate.year;
    var monthDiff = endDate.month - startDate.month;
    var dayDiff = endDate.day - startDate.day;

    var range = (yearDiff*356) + Math.floor(monthDiff*30.5) + dayDiff;

    return range;
  };

  function determineLastMonth (allData) {
    var dates = []

    allData.forEach(function(e){
      dates.push(ymdFormat(e.created_at));
    });
    var length = dates.length;
    var endDate = dates[0];
    var dateRange = null;

    var subRoutine = function(newStart){
      if(dayRange(newStart, endDate) < 32){
        console.log('in base Case - ', newStart);
        dateRange = dayRange(newStart, endDate);
        return;
      }
      var nextDate = dates.pop();
      subRoutine(nextDate);
    };
    subRoutine(dates.pop());

    var contributions = dates.length;
    console.log('Last month contributions - ', contributions);
    console.log('Last month dateRange - ', dateRange);
    var uglyAverage = contributions / 30;
    console.log('Last month ugly average - ', uglyAverage);
    var pastMonthAverage = uglyAverage.toFixed(2);

    return pastMonthAverage;
  };

  function processContributionData (allData, username) {
    var contributions = allData.length
    var startDate = ymdFormat(allData[contributions-1].created_at);
    var endDate = ymdFormat(allData[0].created_at);
    var dateRange = dayRange(startDate, endDate);
    var uglyAverage = contributions / dateRange;
    var overallAverage = uglyAverage.toFixed(2);

    if(dateRange > 30){
      var pastMonthAverage = determineLastMonth(allData);
    }
    
    var result = {
      username: username, 
      total: contributions, 
      dateRange: dateRange,
      overallAverage: overallAverage,
      pastMonthAverage: pastMonthAverage
    }
    return result;
  };

// Not currently being used, but it returns an object in the form of {{date1: freq1}, {date2: freq2}}
// Date is the date a contribution was made by a user and freq is the number of contribs the user made that day
  function contribsPerDay (allData) {
    var dates = {};

    allData.forEach(function(e){
      var ymdDate = e.created_at.slice(0,10);
      dates[ymdDate] = dates[ymdDate] || 0;
      var freq = dates[ymdDate];
      dates[ymdDate] = freq++;
      dates[ymdDate] = freq++;
    });
    console.log('Dates - ', dates);
    return dates;
  }
}

})();









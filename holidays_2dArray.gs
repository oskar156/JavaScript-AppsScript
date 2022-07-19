function holidays_2dArray(years = []) {

  if(years.length == 0) years.push(new Date().getFullYear());

  var col = {

    month: 0,    //1 - 12  //(getMonth() gets the months but 0-indexed, this parameter is 1-indexed)
    date: 1,     //1 - 31  //(use the following param to see if this needs to be modified, leave it at 1 if unsure)
    xth: 2,      //-5 - 5  //(0 means to ignore, > 0 means first, < 0 means last)
    xthDay: 3,   //0 - 6   //(will only be used if xth != 0)
    observed: 4, //-1 - 2  //(0 means to ignore. 1 means only 1 day forward, -1 "" back, 2 means either direction)
  }

  var holidaysDatesOG = [
    [1,  1,   0, 0, 2], //new years day: 1/1 always, can be observed on another day
    [1,  1,   3, 1, 0], //Martin Luther King Jr. Day: 3rd mon of jan
    [5,  1,  -1, 1, 0], //Memorial Day: last mon of may
    [7,  4,   0, 0, 2], //Independence Day: 7/4 always, can be observed on another day
    [9,  1,   1, 1, 0], //Labor Day: 1st mon of sep
    [10, 1,   2, 1, 0], //Columbus Day: 2nd mon of oct
    [11, 11,  0, 0, 2], //Veterans Day: 11/11 always, can be observed on another day
    [11, 1,   4, 4, 0], //Thanksgiving Day: 4th thu of nov
    [12, 25,  0, 0, 2]  //Christmas Day: 12/25 always, can be observed on another day
  ];

  holidayList = [];

  for(var y = 0; y < years.length; y++) {

    var holidayDates = JSON.parse(JSON.stringify(holidaysDatesOG)); //deep copy

    for(var d = 0; d < holidayDates.length; d++) {

      var date = new Date(years[y], holidayDates[d][col.month] - 1, holidayDates[d][col.date]);

      if(holidayDates[d][col.xth] != 0) { //if the date is not absolute

        var xthAbs = holidayDates[d][col.xth];
        if(xthAbs < 0)  {

          xthAbs *= -1;
          date.setDate(31);
        }

        var dayAdjustment = holidayDates[d][col.xth] / xthAbs;
        var matches = 0;

        while(matches < xthAbs) {
    
          if(date.getDay() == holidayDates[d][col.xthDay])
            matches++;

          if(matches < xthAbs)
            date.setDate(date.getDate() + dayAdjustment);
        }

        holidayDates[d][col.date] = date.getDate();
      }

      if(holidayDates[d][col.observed] != 0) { //if the date is observed on another if it falls on a weekend

        var obs = holidayDates[d][col.observed];

        if(date.getDay() == 0 && (obs == 1 || obs == 2)) //if sunday
          date.setDate(date.getDate() + 1);
        else if(date.getDay() == 6 && (obs == -1 || obs == 2))  //if saturday
          date.setDate(date.getDate() - 1);

        holidayDates[d][col.date] = date.getDate();
      }

      holidayList.push([]);
      holidayList[holidayList.length - 1].push(date.getFullYear());
      holidayList[holidayList.length - 1].push(date.getMonth() + 1);
      holidayList[holidayList.length - 1].push(date.getDate());
    }
  }
  Logger.log("holidayList");
  Logger.log(holidayList);
  return holidayList;
}

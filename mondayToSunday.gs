
//------------------------------------------------------------
//RETURNS A DATE RANGE OF THE WEEK A DATE IS IN
//------------------------------------------------------------
function mondayToSunday(currentDate)
{
  //https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
  //currentDate = new Date("March 10, 2024"); //for testing, leave commented out

  //date.getDay() goes from 0-6 sun-sat, which hurts my head, so the below changes it to 1-7 mon-sun
  let day;
  if(currentDate.getDay() == 0) //if sunday
    day = 7;
  else //if any other day
    day = currentDate.getDay();
  
  let monday = new Date(new Date(currentDate).setDate(currentDate.getDate() - (-1 + day))); //monday in the week of currentDate
  let sunday = new Date(new Date(currentDate).setDate(currentDate.getDate() - (day - 7))); //sunday in the week of currentDate
  //Logger.log(new Date(monday));
  //Logger.log(new Date(sunday));

  //YYYMMDD for Monday
  let monYr = String(monday.getFullYear());

  let monMo; //add leading 0 for months less than 10
  if(monday.getMonth() + 1 < 10)
    monMo = "0" + String(monday.getMonth() + 1);
  else
    monMo = String(monday.getMonth() + 1);

  let monDy; //add leading 0 for days less than 10
  if(monday.getDate() < 10)
    monDy = "0" + String(monday.getDate());
  else
    monDy = String(monday.getDate());

  let monFull = `${monYr}${monMo}${monDy}`; //YYYMMDD

  //YYYMMDD for Sunday
  let sunYr = String(sunday.getFullYear());

  let sunMo; //add leading 0 for months less than 10
  if(sunday.getMonth() + 1 < 10)
    sunMo = "0" + String(sunday.getMonth() + 1);
  else
    sunMo = String(sunday.getMonth() + 1);

  let sunDy; //add leading 0 for days less than 10
  if(sunday.getDate() < 10)
    sunDy = "0" + String(sunday.getDate());
  else
    sunDy = String(sunday.getDate());

  let sunFull = `${sunYr}${sunMo}${sunDy}`; //YYYMMDD

  //YYYYMMDD-YYYYMMDD monday-sunday
  let monToSun = `${monFull}-${sunFull}`;
  //Logger.log(monToSun);

  return monToSun;
}
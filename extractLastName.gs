//------------------------------------------------------------
//LAST = TRIMMED SUBSTRING OF THE FULL NAME BEFORE THE LAST SPACE (after we remove the suffix)
//------------------------------------------------------------
function extractLastName(fullName)
{
  let fullNameReversed = fullName.split('').reverse().join('').trim(); 
  
  //remove suffix
  fullNameReversed = fullNameReversed.replace(".", " ");
  if(fullNameReversed.substring(0, 2).toUpperCase() == "I " ||
     fullNameReversed.substring(0, 2).toUpperCase() == "V ")
  {
    fullNameReversed = fullNameReversed.substring(2).trim();
  }
  if(fullNameReversed.substring(0, 3).toUpperCase() == "RJ " || // JR
     fullNameReversed.substring(0, 3).toUpperCase() == "RS " || // SR
     fullNameReversed.substring(0, 3).toUpperCase() == "II " || 
     fullNameReversed.substring(0, 3).toUpperCase() == "VI " || // IV
     fullNameReversed.substring(0, 3).toUpperCase() == "IV ")   // VI
  {
    fullNameReversed = fullNameReversed.substring(3).trim();
  }
  if(fullNameReversed.substring(0, 4).toUpperCase() == "III ")
  {
    fullNameReversed = fullNameReversed.substring(4).trim();
  }

  //after the last space
  let lastNameReversed = fullNameReversed.substring(0, fullNameReversed.indexOf(" ")).trim();
  let lastName = lastNameReversed.split('').reverse().join('').trim();

  return lastName;
}
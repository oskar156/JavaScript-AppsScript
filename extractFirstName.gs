//------------------------------------------------------------
//FIRST = TRIMMED SUBSTRING OF THE FULL NAME BEFORE THE FIRST SPACE (after we remove the title)
//------------------------------------------------------------
function extractFirstName(fullName)
{
  //remove title
  fullName = fullName.replace(".", " ");
  if(fullName.substring(0, 3).toUpperCase() == "DR " ||
     fullName.substring(0, 3).toUpperCase() == "MR " ||
     fullName.substring(0, 3).toUpperCase() == "MS ")
  {
    fullName = fullName.substring(3).trim();
  }
  if(fullName.substring(0, 4).toUpperCase() == "MRS ")
  {
    fullName = fullName.substring(4).trim();
  }

  //before the first space
  let firstName = fullName.substring(0, fullName.indexOf(" ")).trim();
  return firstName;
}
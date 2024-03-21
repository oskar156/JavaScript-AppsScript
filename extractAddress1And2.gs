//------------------------------------------------------------
//RETURNS BOTH ADDRESS1 AND 2 IN AN ARRAY
//LOOKS FOR ADDRESS2 BASED ON: SPACE_KEYWORD_(SPACE OR DASH OR PERIOD]_REST OF THE STRING
//ADDRESS1 IS THEN WHATEVER ADDRESS2 IS NOT
//------------------------------------------------------------
function extractAddress1and2(address)
{
  address = address.toUpperCase().trim();
  let address2Raw = address.match(new RegExp(" (UNIT|APT|APARTMENT|SUITE|SP|SPC|STE|#|ROOM|RM|TRLR|TRAILER|FLOOR|FL |LOT|FRNT|[0-9]+(ST|ND|RD|TH) )([0-9\-\. ]|FL).*$"));
  
  let address1 = address;
  let address2 = "";

  if(address2Raw != null)
  {
    address2 = address2Raw[0].trim();
    address1 = address.substring(0, address.length - address2.length).trim();
  }

  return [address1, address2];
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// binarySearch_2dArray
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function binarySearch_2dArray(array2d, indexToSearch, searchString) {

  var foundIndex = -1;
  var mid;
  var low;
  var high;
   
  low = 0;
  high = array2d.length - 1;
   
  while (high >= low) {
      
    mid = Math.floor((high + low) / 2);
      
    if (array2d[mid][indexToSearch] < searchString)
      low = mid + 1;
    else if (array2d[mid][indexToSearch] > searchString)
      high = mid - 1;
    else {
         
      foundIndex = mid;
      break;
    }
  }
       
  return foundIndex;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// quickSort_2dArray
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function quickSort_2dArray(array2d, indexToSortBy, low, high) {

  //https://docs.google.com/document/d/1EgqRUQBId-qsUXyvkkazT-_L21XT7w43tfHtXzBLNFk/edit
  if(low >= high)
    return array2d;

  var partitionPoint = partition_2dArray(array2d, indexToSortBy, low, high, indexToSortBy); //find a partition point

  quickSort_2dArray(array2d, indexToSortBy, low, partitionPoint); //recursion
  quickSort_2dArray(array2d, indexToSortBy, partitionPoint + 1, high); //recursion

  return array2d;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// partition_2dArray
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function partition_2dArray(array2d, indexToSortBy, low, high) {

  var midpoint = Math.floor((low + high) / 2); //find middle index
  var pivot = array2d[midpoint][indexToSortBy].toString().toUpperCase(); //get middle index's value
  var metAtTheMidPoint = false;

  while(metAtTheMidPoint == false) { //iterate inward from the high and low.

    while(array2d[low][indexToSortBy].toString().toUpperCase() < pivot) //while low index is less than the pivot
      low++; //then move on

    while(array2d[high][indexToSortBy].toString().toUpperCase() > pivot) //while high index is less than the pivot
      high--; //then move on

    if(low >= high) //if the low and high indices meet in the middle, then we're done. the while loop should end
      metAtTheMidPoint = true;
    else { //but if we still have element too look through... //ie if we haven't yet met in the middle of the vector...
        
      var temp = array2d[low]; //then swap the values of low and high indices
      array2d[low] = array2d[high];
      array2d[high] = temp;

      low++; //continue to move both indices
      high--;
    }
  }
 
  return high; //THE RESULTING HIGH AND LOW HALVES WON'T BE SORTED THOUGH, IT'LL ONLY CONTAIN VALUES < or > THAN THE PIVOT 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// quickSortNum_1dArray
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function quickSortNum_1dArray(array1d, low, high) {

  //https://docs.google.com/document/d/1EgqRUQBId-qsUXyvkkazT-_L21XT7w43tfHtXzBLNFk/edit
  if(low >= high)
    return array2d;

  var partitionPoint = partition_1dArray(array1d, low, high); //find a partition point

  quickSort_1dArray(array1d, low,                partitionPoint); //recursion
  quickSort_1dArray(array1d, partitionPoint + 1, high); //recursion

  return array1d;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// quickSortNum_1dArray
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function quickSortNum_1dArray(array1d, low, high) {

  var midpoint = Math.floor((low + high) / 2); //find middle index
  var pivot = array1d[midpoint]; //get middle index's value
  var metAtTheMidPoint = false;

  while(metAtTheMidPoint == false) { //iterate inward from the high and low.

    while(array1d[low] < pivot) //while low index is less than the pivot
      low++; //then move on

    while(array1d[high] > pivot) //while high index is less than the pivot
      high--; //then move on

    if(low >= high) //if the low and high indices meet in the middle, then we're done. the while loop should end
      metAtTheMidPoint = true;
    else { //but if we still have element too look through... //ie if we haven't yet met in the middle of the vector...
        
      var temp = array1d[low]; //then swap the values of low and high indices
      array1d[low] = array1d[high];
      array1d[high] = temp;

      low++; //continue to move both indices
      high--;
    }
  }
 
  return high; //THE RESULTING HIGH AND LOW HALVES WON'T BE SORTED THOUGH, IT'LL ONLY CONTAIN VALUES < or > THAN THE PIVOT 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// quickSort_1dArray
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function quickSort_1dArray(array1d, low, high) {

  //https://docs.google.com/document/d/1EgqRUQBId-qsUXyvkkazT-_L21XT7w43tfHtXzBLNFk/edit
  if(low >= high)
    return array2d;

  var partitionPoint = partition_1dArray(array1d, low, high); //find a partition point

  quickSort_1dArray(array1d, low,                partitionPoint); //recursion
  quickSort_1dArray(array1d, partitionPoint + 1, high); //recursion

  return array1d;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// partition_1dArray
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function partition_1dArray(array1d, low, high) {

  var midpoint = Math.floor((low + high) / 2); //find middle index
  var pivot = array1d[midpoint].toString().toUpperCase(); //get middle index's value
  var metAtTheMidPoint = false;

  while(metAtTheMidPoint == false) { //iterate inward from the high and low.

    while(array1d[low].toString().toUpperCase() < pivot) //while low index is less than the pivot
      low++; //then move on

    while(array1d[high].toString().toUpperCase() > pivot) //while high index is less than the pivot
      high--; //then move on

    if(low >= high) //if the low and high indices meet in the middle, then we're done. the while loop should end
      metAtTheMidPoint = true;
    else { //but if we still have element too look through... //ie if we haven't yet met in the middle of the vector...
        
      var temp = array1d[low]; //then swap the values of low and high indices
      array1d[low] = array1d[high];
      array1d[high] = temp;

      low++; //continue to move both indices
      high--;
    }
  }
 
  return high; //THE RESULTING HIGH AND LOW HALVES WON'T BE SORTED THOUGH, IT'LL ONLY CONTAIN VALUES < or > THAN THE PIVOT 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// quickSort_Object_1dArrays
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function quickSort_Object_1dArrays(object, propToSortBy, propsToSort, low, high, index) {

  if(low >= high)
    return object;

  var partitionPoint = partition_Object_1dArrays(object, propToSortBy, propsToSort, low, high, index); //find a partition point

  quickSort_Object_1dArrays(object, propToSortBy, propsToSort, low,                partitionPoint, index); //recursion
  quickSort_Object_1dArrays(object, propToSortBy, propsToSort, partitionPoint + 1, high, index); //recursion

  return object;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// partition_Object_1dArrays
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function partition_Object_1dArrays(object, array1d, propsToSort, low, high, index) {

  var midpoint = Math.floor((low + high) / 2); //find middle index
  Logger.log(`midpoint ${midpoint}`);
  Logger.log(array1d);
  var pivot = array1d[midpoint].toString().toUpperCase(); //get middle index's value
  var metAtTheMidPoint = false;

  while(metAtTheMidPoint == false) { //iterate inward from the high and low.

    while(array1d[low].toString().toUpperCase() < pivot) //while low index is less than the pivot
      low++; //then move on

    while(array1d[high].toString().toUpperCase() > pivot) //while high index is less than the pivot
      high--; //then move on

    if(low >= high) //if the low and high indices meet in the middle, then we're done. the while loop should end
      metAtTheMidPoint = true;
    else { //but if we still have element too look through... //ie if we haven't yet met in the middle of the vector...
        
      for(let p = 0; p < propsToSort.length; p++) {

        var temp = object[propsToSort[p]][index][low]; //then swap the values of low and high indices
        object[propsToSort[p]][index][low] = object[propsToSort[p]][index][high];
        object[propsToSort[p]][index][high] = temp;
      }

      low++; //continue to move both indices
      high--;
    }
  }
 
  return high; //THE RESULTING HIGH AND LOW HALVES WON'T BE SORTED THOUGH, IT'LL ONLY CONTAIN VALUES < or > THAN THE PIVOT 
}

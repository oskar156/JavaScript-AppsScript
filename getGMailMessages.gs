/*
  //today:     new Date() 
  //example:   new Date("March 10, 2024") 
  //yesterday: new Date(new Date().setDate((new Date()).getDate() - 1)) //https://stackoverflow.com/questions/5511323/calculate-the-date-yesterday-in-javascript
  //get all:   new Date(0) 
*/

//------------------------------------------------------------
//RETURNS AN ARRAY OF ALL THE GMAIL MESSAGES IN THE INBOX OR A LABEL
//------------------------------------------------------------
function getGMailMessages(labelName = "", dateToGet = new Date(0))
{
  let messageObjects = [];
  let threads = [];
  let threadsRemain = true;
  let threadIndex = 0;
  let threadsToGetPerLoop = 100; //max of 500 
  
  let dateFilter = false;
  if(dateToGet.getTime() != new Date(0).getTime())
  {
    dateFilter = true;
  }

  let datePassed = false;
  let page = 1;
  
  //The below loop gets gmail inbox threads in "threadsToGetPerLoop" increments
  //It continues until there are no more threads to get or it passes the date we want
  while(threadsRemain == true && datePassed == false)
  {

    //which gmail label should we get the threads from?
    if(labelName == "") //defults to inbox if user doesn't provide a label name
    {
      threads = GmailApp.getInboxThreads(threadIndex, threadsToGetPerLoop);//gets the threads from the inbox, returns a max of 500 threads
    }
    else
    {
      label = GmailApp.getUserLabelByName(labelName);
      threads = label.getThreads(threadIndex, threadsToGetPerLoop);//gets the threads from the label if it's defined above
    }
    Logger.log("Getting " + String(threadsToGetPerLoop) + " gmail threads starting from index " + String(threadIndex));
    //loop for each email thread
    //this loop will stop early if we are looking for a specifdic date and we pass that date
    for (let i = 0; i < threads.length && datePassed == false; i++)
    { 
      
      let messages = threads[i].getMessages(); //creates an array with all the messages

      //loop for each message in the email thread
      //this loop will stop early if we are looking for a specifdic date and we pass that date

      for (let m = 0; m < messages.length && datePassed == false; m++) 
      {
        
        let msgDt = messages[m].getDate();

        //do we want to choose a specific date?
        let dateComaprison = false;
        if(dateFilter == true)
        {
          //do we want messages from this date?
          if(msgDt.getFullYear() == dateToGet.getFullYear() &&
             msgDt.getMonth() == dateToGet.getMonth() &&
             msgDt.getDate() == dateToGet.getDate()
            )
          {
            dateComaprison = true;
          }

          //did we pass the date we want, so we can tell the loop to stop?
          //messages returned from gmail inbox always seem to be de in descending order by date (newer first)

          //this may be an issue when dealing with email threads that have multiple messages spanning a wide date range
          //a message that's really old in a more recent thread will stop the loop, even through there might be newer messages in the following threads (hope that makes sense)
          //even though this inbox is seemingly all single thread ccpa messages, so we should be fine
          //i still only checked for datePassed if m == 0, so only the first message in a thread (what determines the thread's order in the inbox) will be look at
          //this way nothing will be missed
          if(m == 0)
          {
            if(msgDt.getTime() < new Date(dateToGet.getFullYear(), dateToGet.getMonth(), dateToGet.getDate(), 0, 0, 0, 0).getTime())
            {
              datePassed = true;
            }
          }
        }

        //Logger.log(String(page) + " " + String(i));
        //Logger.log(msgDt);
        //Logger.log(dateToGet);
        //Logger.log(new Date(dateToGet.getFullYear(), dateToGet.getMonth(), dateToGet.getDate(), 0, 0, 0, 0));
        //Logger.log(dateComaprison);
        //Logger.log(datePassed);
        
        if((dateToGet.getTime() == new Date(0).getTime()) || (dateToGet.getTime() != new Date(0).getTime() && dateComaprison == true))
        {
          messageObjects.push(messages[m]);
        }
      }
    }

    //threadsRemain = false; //leave this commented out, just for testing
    if(threads.length == 0)
    {
      threadsRemain = false;
    }

    threadIndex += threadsToGetPerLoop;
    page += 1;
  }

  return messageObjects;
}
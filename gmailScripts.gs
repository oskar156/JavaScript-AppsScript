//gmailScripts.gs

//getGMailMessagePlainBodysByLabel(label, remove = false)

//-----------------------------------------------------------------------------------------------
// getGMailMessagePlainBodysByLabel
//-----------------------------------------------------------------------------------------------
function getGMailMessagePlainBodysByLabel(label, remove = false) {

  var label = GmailApp.getUserLabelByName(label);//which GMail label should this program get the emails from?
  var threads = label.getThreads();//gets the threads from the label defined above (is this an array?)
  var plainBodys = [];

  for (var i = 0; i < threads.length; i++) { //loop for each thread/email

    var messages = threads[i].getMessages(); //creates an array with all the messages
  
    for (var m = 0; m < messages.length; m++) {//loop for each message in the email thread

      plainBodys.push([]);
      plainBodys[plainBodys.length - 1].push(messages[m].getPlainBody());
    }

    if(remove == true)
      threads[i].removeLabel(label); //remove email from label so that we don't get it twice
  }

  return plainBodys;
}

const socket = io("https://chat-socket-io-simple.herokuapp.com");

var users = [];
var scroll ;


let message = document.getElementById("messages");
let user = document.getElementById("user");
let btn = document.getElementById("btn");
let output = document.getElementById("output");
let actions = document.getElementById("actions");
let keypress = document.getElementById("keypress");



btn.addEventListener("click", function () {
 if(message.value != "" && user.value != ""){
  socket.emit("chat:message", {
    message: message.value,
    user: user.value,
  });
  message.value = "";
  message.focus()
 }
});

message.addEventListener("keypress", function () {
  if( user.value != "")
  socket.emit("chat:typing", user.value);
});

message.addEventListener("focusout", function () {
  if( user.value != "")
  socket.emit("chat:typing_out", user.value);
});


socket.on("chat:message", function (data) {
  scroll = output.scrollHeight;
  output.innerHTML += `<p class="msg" style="padding: 0px 0px"><strong>${data.user}</strong> : ${data.message}</p>`;
  if(scroll < output.scrollHeight){
    output.scrollTop += 25;
    scroll = output.scrollHeight
  }
});


socket.on("chat:typing", function (data) {
  var existUser = false;
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if (users[i] == data) {
        existUser = true;
      }
    }
  }

  if (!existUser) {
    users.push(data);
    if(users.length == 1){
      keypress.innerHTML = `<p id="${data}" class="keypress" style="padding: 0px 0px">${data} is typing a message... </p>`;
    }
    if(users.length > 1){
      keypress.innerHTML = `<div id="typing_users" class="keypress" style="padding: 0px 0px"></div>`;
      for(let i = 0; i < users.length; i++){
          document.getElementById("typing_users").innerHTML += `<div class="d-inline" id="${users[i]}"> ${users[i]} </div>`
          if(i != users.length -1 && i != users.length -2 ){
            document.getElementById("typing_users").innerHTML += `<div class="d-inline" id="${users[i] + "y"}">, </div>`
          }
          if(i == users.length -2){
            document.getElementById("typing_users").innerHTML += `<div class="d-inline" id="${users[i] + "y"}"> y </div>`
          }
          
      }
      document.getElementById("typing_users").innerHTML += "are typing a message..."
    }
    
  } 
});

socket.on("chat:typing_out", function (data) {
  for (let i = 0; i < users.length; i++) {
    if (users[i] == data) {
      removeTyping(data);
      users.splice(i, 1);
    }
  }
});

function removeTyping(data) {
  try {
    document.getElementById(data).remove();
    if(!!document.getElementById(data + "y"))
    document.getElementById(data + "y").remove();
    if(users[users.length-1] == data){
      if(!!document.getElementById(users[users.length - 2] + "y"))
      document.getElementById(users[users.length - 2] + "y").remove();
    }
    if(users.length < 2){
      document.getElementById("typing_users").remove();
    }
  } catch (error) {}
}

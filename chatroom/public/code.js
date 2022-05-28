
/*=============================================================================
 |   Assignment:  SOFTWARE ENGINEERING PROJECT - iSKED
 |
 |       Developer:  iSKED MEMBERS
 |     Language:  JAVASCRIPT 
 |   To Compile:  PAGE REDIRECTED TO AFTER THE MAIN LANDING PAGE FOR ENABLING CHAT.
 |
 |        Class:  SOFTWARE ENGINEERING
 |   Instructor:  PROFESSOR MICHEAL LYU
 |     Due Date:  6TH MAY 2022
 |
 +-----------------------------------------------------------------------------
 |
 |  Description:  PROGRAM CREATED FOR MULTIPLE USERS TO INTERACT ON THE PLATFORM. DISPLAYS OPTION TO ADD USERNAME AND ENTER THE CHAT
 |                WHERE EVERYONE IS INTERACTING. THIS FUNCTION ALLOWS MULTIPLE USERS TO COME ON THE PALFORM TOGETEHR, IDENTIFY EACH USER 
 |                USE THE INPUT ELEMENTS AND DISPLAY THAT ON THE USER SCREEN.
 |     
 |
 |        Input:  USER CAN INTEACT WITH OTHER USERS IN THE FORM OF TEXT WHICH IS SHARED ON THE PLAFTFORM'S GROUP CHAT.
 |
 |       Output:  iSKED DISPLAYS THE INTERACTION AMONG VARIOUS USERS WITH THEIR USERNAMES.   
 |
 |
 *===========================================================================*/
(function(){

    const app = document.querySelector(".app");
    const socket = io();

    let uname;
    // DISPLAYS THE USER WHO JOINS ON HTE GROUP CHAT OT OTHER USERS USING SOCKET.IO
    app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        let username = app.querySelector(".join-screen #username").value;
        if(username.length ==0){
            return;
        }
        socket.emit("newuser",username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });
    //THE MESSAGE SENT BY USER IS USED TO SHOW THE USER OUTPUT
    app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        }
        renderMessage("my",{
            username: uname,
            text:message
        });
        socket.emit("chat",{
            username:uname,
            text:message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });
    //THE CHAT SCREEN OF THE USER DISPLAYS EXIT USER WHEN OTHER USERS EXIT THE CHAT
    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
        socket.emit("exituser",uname);
        window.location.href =  window.location.href;
    })

    socket.on("update",function(update){
        renderMessage("update",update);
    });
    socket.on("chat",function(message){
        renderMessage("other",message);
    });

    function renderMessage(type,message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type=="my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
            <div>
                <div class = "name">You</div>
                <div class = "text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        }else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message");
            el.innerHTML = `
            <div>
                <div class = "name">${message.username}</div>
                <div class = "text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);

        }else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        //scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

})();

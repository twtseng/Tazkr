import * as signalR from '@microsoft/signalr';
export class SignalRHub {
    constructor () {
      this.authToken = null;
      this.methodDict = {};
      this.hub = null;
      this.connectionState = "";
    }
    // Add a client method and associated handler
    addMethod(methodName, handler) {
      this.methodDict[methodName] = handler;
    }
    restartHub() {
      this.hub = new signalR.HubConnectionBuilder()
      .withUrl(`/hub`)
      .configureLogging(signalR.LogLevel.Information)
      .build();
  
      for(let methodName in this.methodDict) {
        console.log(`SignalRHub registering method "${methodName}: ${this.methodDict[methodName]}`);
        this.hub.on(methodName, this.methodDict[methodName]);
      }
  
      return this.hub.start();
    }
    startHub(authToken) {
      this.authToken = authToken;
      return this.restartHub();
    }

    send(methodName, p1=null, p2=null, p3=null, p4=null) {
      if (p1 == null) {
        console.log(`SignalRHub send ${methodName}`);
        return this.hub.invoke(methodName, this.authToken);
      } else if (p2 == null) {
        console.log(`SignalRHub send ${methodName}, p1=${p1}`);
        return this.hub.invoke(methodName, this.authToken, p1);
      } else if (p3 == null) {
        console.log(`SignalRHub send ${methodName}, p1=${p1}, p2=${p2}`);
        return this.hub.invoke(methodName, this.authToken, p1, p2);
      } else if (p4 == null) {
        console.log(`SignalRHub send ${methodName}, p1=${p1}, p2=${p2}, p3=${p3}`);
        return this.hub.invoke(methodName, this.authToken, p1, p2, p3);
      } else {
        console.log(`SignalRHub send ${methodName}, p1=${p1}, p2=${p2}, p3=${p3}, p4=${p4}`);
        return this.hub.invoke(methodName, this.authToken, p1, p2, p3, p4);
      } 
    }
  }
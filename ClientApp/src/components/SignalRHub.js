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
    send(methodName, payload="") {
      return this.hub.invoke(methodName, this.authToken, payload);
    }
  }
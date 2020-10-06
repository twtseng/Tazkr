import * as signalR from '@microsoft/signalr';
export class SignalRHub {
    constructor () {
      this.authToken = null;
      this.methodDict = {};
      this.hub = null;
      this.connectionState = "";
    }
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
  
      this.hub.start();
    }
    startHub(authToken) {
      this.authToken = authToken;
      this.restartHub();
    }
    send(methodName, payload) {
      this.hub.invoke(methodName, this.authToken, payload)
      .then(() => console.log(`${methodName} succeeded`))
      .catch(err => { console.log(`${methodName} failed, ${err}. Attempting reconnect`);  this.restartHub();})
    }
  }
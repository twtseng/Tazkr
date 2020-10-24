import * as signalR from '@microsoft/signalr';
const maxRetryAttempts = 4;
export class SignalRHub {
  constructor () {
    this.authToken = null;
    this.methodDict = {};
    this.hub = null;
    this.connectionState = "";
  }
  // Add a client method and associated handler
  setMethods(methodDict) {
    this.methodDict = methodDict;
  }
  restartHub() {
    this.hub = new signalR.HubConnectionBuilder()
    .withUrl(`/hub`)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
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
  callAction(groupId, payload, retryAttempt=0) {
    if (retryAttempt > maxRetryAttempts)
    {
      console.log(`SignalRHub callAction maxRetryAttempts of [${maxRetryAttempts}] exceeded. Payload: [${payload}]`);
    }
    console.log(`SignalRHub callAction groupId=${groupId} payload=${payload}, connection state=${this.hub.state}`);
    if (this.hub.state === signalR.HubConnectionState.Connected) {
      this.hub.invoke('CallAction', this.authToken, groupId, payload)
      .then(() => console.log(`SignalRHub callAction: groupId[${groupId}] payload=${payload} succeeded`))
      .catch(err => { console.log(`SignalRHub callAction: groupId[${groupId}] payload=${payload} failed, ${err}. Attempting reconnect`);  this.restartHub() });
    }
    else if (this.hub.state === signalR.HubConnectionState.Connecting) {
      console.log("SignalRHub callAction: Currently connecting, retry callAction in 500 ms ===")
      setTimeout(() => this.callAction(groupId, payload, retryAttempt+1), 500);
    } else {
      console.log(`SignalRHub callAction: Current connection state: ${this.hub.state}, restarting hub and retry callAction in 1 second ===`);
      this.restartHub()
      .then(() => { setTimeout(() => this.callAction(groupId, payload, retryAttempt+1), 1000)});        
    } 
  }
}
import * as signalR from '@microsoft/signalr';
const maxRetryAttempts = 4;

export type HubMethod =  (
  arg1:Object,
  arg2:Object,
  arg3:Object,
  arg4:Object
) => void;

export class SignalRHub {
  authToken : string | null;
  methodHandlers : Map<string, HubMethod>;
  hub : signalR.HubConnection;
  constructor () {
    this.authToken = null;
    this.methodHandlers = new Map<string, HubMethod>();
    this.hub = new signalR.HubConnectionBuilder()
    .withUrl(`/hub`)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();
    this.hub.on("ServerMessage", this.handleServerMessage);
  }
  setMethod = (methodName:string, methodHandler: HubMethod) => {
    console.log(`setMethod: method[${methodName}] handler[${methodHandler}]`);
    this.methodHandlers.set(methodName, methodHandler);
    console.log(`setMethod: this.methodHandlers[methodName]: ${this.methodHandlers.get(methodName)}`);
  }
  handleServerMessage = (methodName:string, arg1:Object, arg2:Object, arg3:Object, arg4:Object) => {
    if (this.methodHandlers.has(methodName)) {
      console.log(`handleServerMessage, methodName=[${methodName}] found, executing...`);
      const hubMethod = this.methodHandlers.get(methodName);
      if (hubMethod !== undefined) {
        hubMethod(arg1, arg2, arg3, arg4);
      }
    } else {
      console.log(`handleServerMessage, methodName=[${methodName}] NOT found`);
    }
  }
  startHub = (authToken: string) => {
    console.log(`=== SignalRHubTS startHub ===`);
    this.authToken = authToken;
    return this.hub.start();
  }

  callServerMethod = (method: string, payload: string, retryAttempt=0) => {
    if (retryAttempt > maxRetryAttempts)
    {
      console.log(`SignalRHub callServerMethod maxRetryAttempts of [${maxRetryAttempts}] exceeded. Payload: [${payload}]`);
    }
    console.log(`SignalRHub callServerMethod method=${method} payload=${payload}, connection state=${this.hub.state}`);
    if (this.hub.state === signalR.HubConnectionState.Connected) {
      this.hub.invoke(method, payload)
      .then(() => console.log(`SignalRHub callServerMethod: method[${method}] payload=${payload} succeeded`))
      .catch(err => { console.log(`SignalRHub callServerMethod: method[${method}] payload=${payload} failed, ${err}.`) });
    }
    else {
      console.log(`SignalRHub callServerMethod: State=${this.hub.state}, retry callAction in 500 ms ===`)
      setTimeout(() => this.callServerMethod(method, payload, retryAttempt+1), 500);
    } 
  }
  joinChat = (chatId: string) => {
    this.callServerMethod("JoinChat", chatId);
  }
}
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
    console.log(`setMethodTESTTS: method[${methodName}] handler[${methodHandler}]`);
    this.methodHandlers.set(methodName, methodHandler);
    console.log(`setMethodTESTTS: this.methodHandlers[methodName]: ${this.methodHandlers.get(methodName)}`);
  }
  handleServerMessage = (methodName:string, arg1:Object, arg2:Object, arg3:Object, arg4:Object) => {
    if (this.methodHandlers.has(methodName)) {
      console.log(`handleServerMessageTS, methodName=[${methodName}] found, executing...`);
      const hubMethod = this.methodHandlers.get(methodName);
      if (hubMethod !== undefined) {
        hubMethod(arg1, arg2, arg3, arg4);
      }
    } else {
      console.log(`handleServerMessageTS, methodName=[${methodName}] NOT found`);
    }
  }
  startHub = (authToken: string) => {
    console.log(`=== SignalRHubTS startHub ===`);
    this.authToken = authToken;
    return this.hub.start();
  }
}
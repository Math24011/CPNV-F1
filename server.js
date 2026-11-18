const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.static(path.join(__dirname, "public")));
const CODE = "CPNV", MAX = 8;
const players = new Map();
let raceStarted = false;
function snapshot(){ return [...players.values()].map(p=>({id:p.id,name:p.name,ready:p.ready})); }
function broadcast(){ io.emit("lobby",{players:snapshot()}); }
io.on("connection", socket=>{
 socket.on("joinLobby", ({code,name}={})=>{
  if(code!==CODE) return socket.emit("joinError","Code incorrect.");
  if(raceStarted) return socket.emit("joinError","La course a déjà commencé.");
  if(players.size>=MAX) return socket.emit("joinError","Lobby complet (8 pilotes maximum).");
  const clean=String(name||"").trim().slice(0,16);
  if(!clean) return socket.emit("joinError","Choisis un pseudo.");
  if([...players.values()].some(p=>p.name.toLowerCase()===clean.toLowerCase())) return socket.emit("joinError","Ce pseudo est déjà utilisé.");
  players.set(socket.id,{id:socket.id,name:clean,ready:false,x:500,y:130,angle:-Math.PI/2,speed:0,lap:1});
  socket.emit("joined",{id:socket.id}); broadcast();
 });
 socket.on("ready",({ready}={})=>{
  const p=players.get(socket.id); if(!p||raceStarted)return;
  p.ready=!!ready; broadcast();
  if(players.size>=2 && [...players.values()].every(x=>x.ready)){
   raceStarted=true; io.emit("raceStart",{players:snapshot()});
  }
 });
 socket.on("position",pos=>{
  const p=players.get(socket.id); if(!p||!raceStarted)return;
  p.x=Number(pos.x)||0;p.y=Number(pos.y)||0;p.angle=Number(pos.angle)||0;p.speed=Number(pos.speed)||0;p.lap=Number(pos.lap)||1;
  io.emit("positions",snapshotPositions());
 });
 socket.on("leaveRace",()=>{ if(players.has(socket.id)){raceStarted=false;for(const p of players.values())p.ready=false;io.emit("raceReset");broadcast();}});
 socket.on("leaveLobby",()=>{players.delete(socket.id);broadcast();});
 socket.on("disconnect",()=>{if(players.delete(socket.id)){if(raceStarted){raceStarted=false;for(const p of players.values())p.ready=false;io.emit("raceReset");}broadcast();}});
});
function snapshotPositions(){return [...players.values()].map(p=>({id:p.id,name:p.name,x:p.x,y:p.y,angle:p.angle,speed:p.speed,lap:p.lap}));}
const port=process.env.PORT||3000;
server.listen(port,()=>console.log("CPNV F1 listening on "+port));
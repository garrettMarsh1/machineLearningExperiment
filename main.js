
const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
const trafficNetworkCanvas=document.getElementById("trafficNetworkCanvas");
trafficNetworkCanvas.width=100;

let trafficBrain = TrafficNeuralNetwork.trafficBrain

carCanvas.width=200;

const carCtx=carCanvas.getContext("2d");

const networkCtx=networkCanvas.getContext("2d");
const trafficNetworkCtx=trafficNetworkCanvas.getContext("2d");
const trafficCtx=carCanvas.getContext("2d");


const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N = 1000;
const N2 = 30;
const cars = generateCars(N);
const traffic = generateTraffic(N2);
let bestPath = cars[0];
let bestTrafficPath = traffic[0];
let worstPath = cars[0];
if(localStorage.getItem("bestRuns")){
    for(let i = 0; i < cars.length; i++){
        cars[i].brain = JSON.parse
        (localStorage.getItem("bestRuns"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, .2002);
        }
    }
}

if(localStorage.getItem("bestTrafficRuns")){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].trafficBrain = JSON.parse
        (localStorage.getItem("bestTrafficRuns"));
        if(i!=0){
            TrafficNeuralNetwork.mutateTraffic(traffic[i].trafficBrain, .1964);
        }
    }
}




// const traffic=[
//     new Car(road.getLaneCenter(1),-100,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(0),-300,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(2),-300,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(1),-100,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(0),-500,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(1),-500,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(2),-700,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(0),-721,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(2),-800,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(1),-920,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(0),-1030,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(2),-1030,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(1),-1120,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(0),-1230,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(2),-1450,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(1),-1620,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(0),-1630,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(2),-1780,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(1),-1820,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(2),-1920,30,50,"BOT",2*Math.random()),
//     new Car(road.getLaneCenter(0),-1898,30,50,"BOT",2*Math.random()),
    
// ];

animate();

//saving and discard best/worst traffic runs
function saveBestCar() {
    localStorage.setItem("bestRuns", 
    JSON.stringify(bestPath.brain));
}


function discardWorstCars(){
    localStorage.removeItem("worstRuns",
           JSON.stringify(worstPath.brain));

}

function discardBestCars(){
    localStorage.removeItem("bestRuns",
           JSON.stringify(bestPath.brain));

}


//saving and discard best/worst traffic runs
function saveBestTraffic() {
    localStorage.setItem("bestTrafficRuns", 
    JSON.stringify(bestTrafficPath.trafficBrain));
}

function discardBestTraffic(){
    localStorage.removeItem("worstTrafficRuns",
           JSON.stringify(worstTrafficPath.trafficBrain));

}

function discardWorstTraffic(){
    localStorage.removeItem("bestTrafficRuns",
           JSON.stringify(worstTrafficPath.trafficBrain));

}



function generateCars(N){
    let cars=[];
    for(let i =1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function generateTraffic(N2){
    const traffic=[];
    for(let i =1;i<=N2;i++){
        traffic.push(new Traffic(
            road.getLaneCenter(random(0,3)),random(-3000, 0),15,30,"BOT",2));

    }
    return traffic;
}



function animate(time){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, [],traffic, cars);
    }
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic, cars);
    }

    bestPath = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)

        ));
    worstPath = cars.find(
        c=>c.y==Math.max(
            ...cars.map(c=>c.y)

        ));

    bestTrafficPath = cars.find(
        c=>c.y==Math.min(
            ...traffic.map(c=>c.y)

        ));
    worstTrafficPath = cars.find(
        c=>c.y==Math.max(
            ...traffic.map(c=>c.y)

        ));


    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    trafficNetworkCanvas.height = window.innerHeight;
    
    
    carCtx.save();
    carCtx.translate(0, -bestPath.y + carCanvas.height*0.7);

    road.draw(trafficCtx);
    for(let i =0; i<traffic.length; i++){
        traffic[i].draw(trafficCtx, "black");
    }
    bestTrafficPath
    
    
    carCtx.globalAlpha = 0.2;

    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "orange");
    }
    carCtx.globalAlpha = 1;
    bestPath.draw(carCtx, "orange", true);

    carCtx.restore();

    carCtx.globalAlpha = 0.2;

    

    networkCtx.lineDashOffset = -time/50;

    //Visualizer.drawNetwork(trafficNetworkCtx, bestTrafficPath.trafficBrain);
    Visualizer.drawNetwork( networkCtx, bestPath.brain);

    requestAnimationFrame(animate);
};



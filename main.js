const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

carCanvas.width=200;

const carCtx=carCanvas.getContext("2d");

const networkCtx=networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N = 100;
const N2 = 100;
const cars = generateCars(N);
const traffic = generateTraffic(N2);
let bestPath = cars[0];
let worstPath = cars[0];
if(localStorage.getItem("bestRuns")){
    for(let i = 0; i < cars.length; i++){
        cars[i].brain = JSON.parse
        (localStorage.getItem("bestRuns"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, .1964);
        }
    }
}




// const traffic=[
//     new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(0),-721,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(2),-800,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(1),-920,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(0),-1030,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(2),-1030,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(1),-1120,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(0),-1230,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(2),-1450,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(1),-1620,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(0),-1630,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(2),-1780,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(1),-1820,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(2),-1920,30,50,"DUMMY",2*Math.random()),
//     new Car(road.getLaneCenter(0),-1898,30,50,"DUMMY",2*Math.random()),
    
// ];

animate();

function save() {
    localStorage.setItem("bestRuns", 
    JSON.stringify(bestPath.brain));
}



function discard(){
    localStorage.removeItem("bestRuns");
}

function generateCars(N){
    let cars=[];
    for(let i =1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }


function generateTraffic(N2){
    const traffic=[];
    
    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    
    const randomY = random(-200, -100);
    const computerResponse = random(0, 3);
    for(let i =1;i<=N2;i++){
        traffic.push(new Car(road.getLaneCenter(computerResponse),randomY,30,50,"DUMMY",2));
    }
    return traffic;
}



function animate(time){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, [], cars);
    }
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic, cars);
    }

    bestPath = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)

        ));
    worstPath = cars.find(
        c=>c.y==-Math.min(
            ...cars.map(c=>c.y)

        ));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0, -bestPath.y + carCanvas.height*0.7);
    
    road.draw(carCtx);
    for(let i =0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "darkgreen");
    }
    
    
    carCtx.globalAlpha = 0.2;

    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "orange");
    }
    carCtx.globalAlpha = 1;
    bestPath.draw(carCtx, "orange", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;

    Visualizer.drawNetwork(networkCtx, bestPath.brain);
    requestAnimationFrame(animate);
};



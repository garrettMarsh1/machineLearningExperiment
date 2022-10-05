
const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;


//let brain = TrafficNeuralNetwork.brain

carCanvas.width=200;

const carCtx=carCanvas.getContext("2d");

const networkCtx=networkCanvas.getContext("2d");
const trafficCtx=carCanvas.getContext("2d");


const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

//N = number of cars generated
const N = 500;
// N2 = number of traffic generated
const N2 = 70;


//generate cars
const cars = generateCars(N);

//generate traffic
const traffic = generateTraffic(N2);



// bestPath assigned to cars array will be used to draw the best path
let bestPath = cars[0];
//bestTrafficPath assigned to traffic array will be used to draw the best path
// let bestTrafficPath = traffic[0];

//worst path taken by the car and traffic objects meant to be discarded to optimize learning
let worstPath = cars[0];
// let worstTrafficPath = traffic[0];

//saving best runs for car
if(localStorage.getItem("bestRuns")){
    for(let i = 0; i < cars.length; i++){
        cars[i].brain = JSON.parse
        (localStorage.getItem("bestRuns"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, .1);
        }
       
    }
}
//loading best runs for the traffic 
// if(localStorage.getItem("bestTrafficRuns")){
//     for(let i = 0; i < traffic.length; i++){
//         traffic[i].trafficBrain = JSON.parse
//         (localStorage.getItem("bestTrafficRuns"));
//         if(i!=0){
//             TrafficNeuralNetwork.mutateTraffic(traffic[i].trafficBrain, .054);
//         }
//     }
// }



//this is the traffic that is hardcoded to appear according to specific coordinates meant for testing 
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

//saving and discard best/worst traffic runs from storage
function saveBestCar() {
    localStorage.setItem("bestRuns", 
    JSON.stringify(bestPath.brain));
}

// discarding worst car paths from storage
function discardWorstCars(){
    localStorage.removeItem("worstRuns",
           JSON.stringify(worstPath.brain));
}

// discards best car paths from storage
function discardBestCars(){
    localStorage.removeItem("bestRuns",
           JSON.stringify(bestPath.brain));
}




/**
 * function that generates cars by a value of N
 * @param {*} N 
 * @returns 
 */
function generateCars(N){
    let cars=[];
    for(let i =1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
        
        console.log(cars.damaged);
        
    }
    return cars;
}

// function nextGenerationLoad(cars){
    
//     ;
//    
// }
// nextGenerationLoad();










/**
 * function that generates traffic by a value of N2 while testing car size to prevent traffic congestion
 * @param {*} N2 
 * @param {*} carSize 
 * @returns 
 */
 function generateTraffic(N2){
    let traffic=[];
    
    for(let i =1;i<=N2;i++){
        
        let trafficItem = new Traffic(road.getLaneCenter(random(0,3)),random(-20000, 0),30,50,"DUMMY", random(3, 5));
        //let trafficItem2 = new Traffic(road.getLaneCenter(2),random(-10000, 0),30,50,"trafficAI", 3 );
        //let trafficItem3 = new Traffic(road.getLaneCenter(3),random(-10000, 0),30,50,"trafficAI", 3 )

        traffic.push(trafficItem);
        

        //traffic.push(trafficItem);

        //let itemWillBlock = willTrafficBlock(road, traffic, trafficItem, carSize, trafficSize);

        // if (trafficItem.x != trafficItem2.x) {
        //     traffic.push(trafficItem, trafficItem2, trafficItem3);
                  
        // } else {
        //     if(trafficItem2.x == trafficItem.x){
        //           traffic.pop( trafficItem2, trafficItem3);
        //         }
            
        // }
        //console.log( trafficItem,);

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



    // logic for the best car path
    bestPath = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y),
        ));

  

        if(cars.filter(c=>c.damaged).length>=cars.length*0.999999){
            saveBestCar();
            discardWorstCars();
            location.reload();
        }
   

    // logic for the worst car path
    worstPath = cars.find(
        c=>c.y==Math.max(
            ...cars.map(c=>c.y)

        ));
   


    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
   
    
    
    carCtx.save();
    carCtx.translate(0, -bestPath.y + carCanvas.height*0.7);

    road.draw(carCtx);

    // drawing traffic
    for(let i =0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "black");
    }
    
    
    
    
    // opacity of the parallel cars in current run
    carCtx.globalAlpha = 0.2;

    // drawing cars
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "orange");
    }
    // opacity of the best car in current run
    carCtx.globalAlpha = 1;
    // drawing the best car in current run
    bestPath.draw(carCtx, "orange", true);

    carCtx.restore();

    carCtx.globalAlpha = 0.2;

    

    networkCtx.lineDashOffset = -time/50;


    //drawing the best traffic neural network
    //TrafficVisualizer.drawTrafficNetwork(trafficNetworkCtx, bestTrafficPath.trafficBrain);

    // drawing the best car's neural network
    Visualizer.drawNetwork( networkCtx, bestPath.brain);

    requestAnimationFrame(animate);
};






// https://lz4.overpass-api.de/api/interpreter&API_KEY-77180fa3733c7ceda626d88f0f580aad

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
const N = 100;
// N2 = number of traffic generated
const N2 = 100;
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
            NeuralNetwork.mutate(cars[i].brain, 7);
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


//saving and discard best/worst traffic runs



// //save best traffic runs to storage
// function saveBestTraffic() {
//     localStorage.setItem("bestTrafficRuns", 
//     JSON.stringify(bestTrafficPath.trafficBrain));
// }

// //discards best traffic paths from storage
// function discardBestTraffic(){
//     localStorage.removeItem("worstTrafficRuns",
//            JSON.stringify(worstTrafficPath.trafficBrain));

// }

// //discards worst traffic paths from storage
// function discardWorstTraffic(){
//     localStorage.removeItem("bestTrafficRuns",
//            JSON.stringify(worstTrafficPath.trafficBrain));

// }


/**
 * function that generates cars by a value of N
 * @param {*} N 
 * @returns 
 */
function generateCars(N){
    let cars=[];
    for(let i =1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

/**
 * function that generates traffic by a value of N2 while testing car size to prevent traffic congestion
 * @param {*} N2 
 * @param {*} carSize 
 * @returns 
 */
 function generateTraffic(N2, carSize){
    let traffic=[];
    
    for(let i =1;i<=N2;i++){
        
        let trafficItem = new Traffic(road.getLaneCenter(random(0,3)),random(-3000, 0),30,50,"trafficAI");
        

        traffic.push(trafficItem);

        let itemWillBlock = willTrafficBlock(road, traffic, trafficItem, carSize);

        console.log(itemWillBlock);
        
        if (!itemWillBlock) {
            console.log("innit bruv")
            traffic.push(trafficItem);
            

            
        } else {
            //traffic.push(trafficItem);
            // decide if you just skip adding all together or try to generate another piece and see if it will fit
            console.log("im innit bruv")
        }
        console.log(trafficItem)

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
            ...cars.map(c=>c.y)

        ));
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
        traffic[i].draw(trafficCtx, "black");
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



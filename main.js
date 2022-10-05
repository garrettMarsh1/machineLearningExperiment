const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
carCanvas.width=200;
const carCtx=carCanvas.getContext("2d");
const networkCtx=networkCanvas.getContext("2d");
<<<<<<< HEAD
//const carCtx=carCanvas.getContext("2d");


=======
const trafficCtx=carCanvas.getContext("2d");
>>>>>>> 44a990f09f3b8f27b1e6795d58115353d3f63184
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

if(localStorage.getItem("bestTrafficRuns")){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].brain = JSON.parse
        (localStorage.getItem("bestTrafficRuns"));
        if(i!=0){
            NeuralNetwork.mutate(traffic[i].brain, .5);
        }
       
    }
}

animate();

//saving and discard best/worst traffic runs from storage
function saveBestCar() {
    localStorage.setItem("bestRuns", 
    JSON.stringify(bestPath.brain));
}

function saveBestTraffic() {
    localStorage.setItem("bestTrafficRuns", 
    JSON.stringify(bestTrafficPath.brain));
}

// discarding worst car paths from storage
function discardWorstCars(){
    localStorage.removeItem("worstRuns",
           JSON.stringify(worstPath.brain));
}

function discardWorstTRaffic(){
    localStorage.removeItem("worstTrafficRuns",
           JSON.stringify(worstTrafficPath.brain));
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

/**
 * function that generates traffic by a value of N2 while testing car size to prevent traffic congestion
 * @param {*} N2 
 * @param {*} carSize 
 * @returns 
 */
<<<<<<< Updated upstream
 function generateTraffic(N2){
    let traffic=[];
    
=======
 function generateTraffic(N2, carSize){
    let traffic=[];
    //carSize = []
>>>>>>> Stashed changes
    for(let i =1;i<=N2;i++){
        
        let trafficItem = new Traffic(road.getLaneCenter(random(0,3)),
        random(-20000, 0),30,50,"DUMMY", random(3, 5));
        traffic.push(trafficItem);
        
<<<<<<< HEAD
<<<<<<< Updated upstream

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
=======
        let trafficItem = new Traffic(road.getLaneCenter(random(0,3)),random(-300, 300),30,50,"trafficAI");
        traffic.push(trafficItem);
        let itemWillBlock = willTrafficBlock(road,  traffic, trafficItem, carSize);
        if (!itemWillBlock) {
            traffic.push(trafficItem);
            
        } else {
            
            
            // decide if you just skip adding all together or try to generate another piece and see if it will fit
        }
        console.log(trafficItem)
>>>>>>> Stashed changes

=======
>>>>>>> 44a990f09f3b8f27b1e6795d58115353d3f63184
    }
    return traffic;
    
}


<<<<<<< Updated upstream

<<<<<<< HEAD









=======
>>>>>>> Stashed changes
=======
>>>>>>> 44a990f09f3b8f27b1e6795d58115353d3f63184
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

    bestTrafficPath = traffic.find(
        c=>c.y==Math.min(
            ...traffic.map(c=>c.y),
        ));


   

    // logic for the worst car path
    worstPath = cars.find(
        c=>c.y==Math.max(
            ...cars.map(c=>c.y)

        ));
   
    //if %99 cars are damaged, save best path, discard worst, then reload page.
    if(cars.filter(c=>c.damaged).length>=cars.length*0.999999){
        saveBestCar();
        saveBestTraffic();
        discardWorstTraffic();
        discardWorstCars();
        history.go(0)
    }

    //refresh page after 4 minutes
    setTimeout(function(){
        discardBestCars();
        saveBestCar();
        discardWorstCars();
        history.go(0);
    }, 240000);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
   

    carCtx.save();
    carCtx.translate(0, -bestPath.y + carCanvas.height*0.7);

    road.draw(carCtx);

    // drawing traffic
    for(let i =0; i<traffic.length; i++){
<<<<<<< Updated upstream
        traffic[i].draw(carCtx, "black");
=======
        traffic[i].draw(carCtx);
>>>>>>> Stashed changes
    }
<<<<<<< HEAD
 
=======
  
>>>>>>> 44a990f09f3b8f27b1e6795d58115353d3f63184
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
    // drawing the best car's neural network
    Visualizer.drawNetwork( networkCtx, bestPath.brain);

    requestAnimationFrame(animate);
};







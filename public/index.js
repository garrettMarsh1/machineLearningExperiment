


const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);





//N = number of cars generated
const N = 10;
// N2 = number of traffic generated
const N2 = 50;

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
(async function () {
    // body of the function
    if (localStorage.getItem("bestRuns")) {
    
        const request = await fetch("/pull");
        const response = await request.json();
    
        if (response.message) console.log(response);
        console.log(JSON.parse(localStorage.getItem("bestRuns")))

        let syncData = response.data.map( data => {
            return data.levels;
        })


        syncData = syncData.flat(6);

        console.log(syncData);
    
        for(let i = 0; i < cars.length; i++){
    
    
            cars[i].brain = (syncData.length != 0) ? { levels: syncData } : JSON.parse(localStorage.getItem("bestRuns"));
    
            if(i!= 0){
                NeuralNetwork.mutate(cars[i].brain, .1);
            }
           
        }
    
    }
    
    if(localStorage.getItem("bestTrafficRuns")){
        for(let i = 0; i < traffic.length; i++){
            traffic[i].brain = JSON.parse
            (localStorage.getItem("bestTrafficRuns"));
            if(i!= 0){
                NeuralNetwork.mutate(traffic[i].brain, .01);
            }
           
        }
    }
    
}());

animate();


//saving and discard best/worst traffic runs from storage
async function saveBestCar() {
    localStorage.setItem("bestRuns", 
    JSON.stringify(bestPath.brain));


    const options = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify(bestPath.brain)
    }

    console.log('Best Car:', bestPath);

    const request = await fetch("/sync", options);
    const response = await request.json();

    console.log(response);

    if (response.ok) console.log("successfully saved data to server");
    if (response.error) console.log("Roh oh raggie");
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

function discardWorstTraffic(){
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
    let cars = [];
    for(let i = 1; i <= N;i++){
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
 function generateTraffic(N2){
    let traffic = [];
    
    for(let i = 1;i <= N2; i++){
        
        let trafficItem = new Traffic(road.getLaneCenter(random(0,3)),
        random(-20000, 0),30,50,"AI", random(3,5));
        traffic.push(trafficItem);
        
    }
    return traffic;
    
}



function animate(time){

    
    for(let i = 0; i<traffic.length; i++){
        traffic[i].update(road.borders, [],traffic, cars);
    }
    for(let i = 0; i<cars.length; i++){
        cars[i].update(road.borders, traffic, cars);
    }



    // logic for the best car path
    bestPath = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y),
        ));

    bestTrafficPath = traffic.find(
        c => c.y == Math.min(
            ...traffic.map(c => c.y),
        ));


    // logic for the worst car path
    worstPath = cars.find(
        c => c.y == Math.max(
            ...cars.map(c => c.y)

        ));
    // logic for the worst car path
    worstTrafficPath = traffic.find(
        c => c.y == Math.max(
            ...traffic.map(c => c.y)

        ));
   
    //if %99 cars are damaged, save best path, discard worst, then reload page.
    if (cars.filter(c => c.damaged).length >=  cars.length*0.35) {
        
        discardWorstTraffic();
        discardWorstCars();
        discardBestCars();
        saveBestCar();
        saveBestTraffic(); 
        history.go(0);
    }

    //refresh page after 4 minutes
    setTimeout(function(){
        discardBestCars();
        saveBestCar();
        discardWorstCars();
        history.go(0);
    }, 240000/2);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
   

    carCtx.save();
    carCtx.translate(0, -bestPath.y + carCanvas.height*0.7);

    road.draw(carCtx);

    // drawing traffic
    for(let i  = 0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "green");
    }
  
    // opacity of the parallel cars in current run
    carCtx.globalAlpha = 0.2;

    // drawing cars
    for(let i = 0; i<cars.length; i++){
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

// HEKDAHBFJKAD:JFJKADJHGJLAJSILF





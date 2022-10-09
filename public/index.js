document.getElementById('vehicleCount').value=
    localStorage.getItem("vehicleCount") || 250;
document.getElementById('mutFac').value=
    localStorage.getItem("mutFac") || '0.5';

const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=500;
carCanvas.width=450;
const carCtx=carCanvas.getContext("2d");
const networkCtx=networkCanvas.getContext("2d");
const road=new Road(carCanvas.width/2,carCanvas.width*0.9);



//N = number of cars generated
const N=Number(document.getElementById('vehicleCount').value);
// N2 = number of traffic generated
const N2 = 100;

if(!localStorage.getItem("defaultCar")){
    localStorage.setItem("defaultCar","true");
    localStorage.setItem("bestPath",
    '{"levels":[{"inputs":[0.7134037395397386,0.4704391617329813,0,0,0],"outputs":[1,0,1,0,1,1],"biases":[-0.2857065784574137,0.15198050810320685,-0.13924253314793095,0.11578316440435818,-0.16178778119340148,-0.3000903730682978],"weights":[[-0.13515557540433842,0.07300698004528629,0.0040602602910803365,-0.06511672542187383,0.2351613353184897,-0.2012322725070096],[0.11375478789219415,0.19674169055322577,-0.10038853369062525,-0.08805459204957476,0.21925787393967702,0.15340538795108272],[0.006771304836725459,0.19973693546258126,-0.054730364561966574,-0.31855113026094745,-0.18011218120061373,-0.07367159677011853],[0.10788433228858771,-0.08604768151855152,-0.16601129743851203,-0.00019124113279275767,-0.2387343271874623,0.024133579587637094],[0.016549344407090646,0.07491472818610108,0.01776519928759422,0.061508369764843265,-0.22340799373690096,-0.04158178250497961]]},{"inputs":[1,0,1,0,1,1],"outputs":[1,1,1,0],"biases":[-0.06116069156441874,-0.0723274390864902,0.040602477018632524,0.36214587805918513],"weights":[[0.08902059474663654,-0.15740460212292795,-0.33036790341757627,-0.09502772355825113],[-0.025343350670927654,-0.3306790265709002,-0.015918008460683405,-0.3003507035765679],[0.3227266376583849,0.38057846051375693,0.18707727773028537,0.053444661926534916],[-0.2025644147140744,0.1184725671846302,-0.09069904024640596,-0.12430190885008531],[0.07527020196440684,-0.230469927588571,0.3007741658810536,0.22218297028978307],[-0.01361908920713352,0.16609276689516542,-0.09581290649261008,-0.039394098855477074]]}]}');
}


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

//getting best runs for car



newGenerations();
animate();



function newGenerations(){
    if(localStorage.getItem("bestRuns")){
        for(let i = 0; i < cars.length; i++){
            cars[i].brain = JSON.parse
            (localStorage.getItem("bestRuns"));
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain, Number(document.getElementById('mutFac').value));
            }
        
        }
    }

    if(localStorage.getItem("bestTrafficRuns")){
        for(let i = 0; i < traffic.length; i++){
            traffic[i].brain = JSON.parse
            (localStorage.getItem("bestTrafficRuns"));
            if(i!=0){
                NeuralNetwork.mutate(traffic[i].brain, .1);
                }
            }
        }
}

(async function () {
    // body of the function
     if (localStorage.getItem("bestRuns")) {
    
        const request = await fetch("/pull");
        const response = await request.json();
    
        if (response.message) console.log(response);
       //console.log(JSON.parse(localStorage.getItem("bestRuns")))

        let syncData = response.data.map( data => {
            return data.levels;
        })


        syncData = syncData.flat();

        //console.log(syncData);
    
        for(let i = 0; i < cars.length; i++){
    
    
            //cars[i].brain = (syncData.length != 0) ? { levels: syncData } : JSON.parse(bestPath.brain);
    
            if(i!= 0){
             NeuralNetwork.mutate(cars[i].brain,Number(document.getElementById('mutFac').value));
            }
           
        }
    
    }

    
}());

function saveBestCarLocal() {
    localStorage.setItem("bestRuns", 
    JSON.stringify(bestPath.brain));
}


async function saveBestCarDB() {
    // localStorage.setItem("bestRuns", 
    // JSON.stringify(bestPath.brain));


    const options = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify(bestPathDB.brain)
    }

    console.log('Best Car:', bestPath);

    const request = await fetch("/sync", options);
    const response = await request.json();

    console.log(response);

    if (response.ok) console.log("successfully saved data to server");
    if (response.error) console.log("Roh oh raggie");
}





//saving and discard best/worst traffic runs from storage

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
    let cars=[];
    for(let i =1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(2),100,40,60,"AI"));
        
        
        
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
    let traffic=[];
    
    for(let i =1;i<=N2;i++){
        
        let trafficItem = new Traffic(road.getLaneCenter(random(0,5)),
        random(-20000, 0),40,60,"AI", random(3,5));
        traffic.push(trafficItem);
        
    }
    return traffic;
    
}



async function animate(time){

    
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic, road);    
    }



    // logic for the best car path
    bestPath = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y),
        ));

    bestPathDB = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y),
        ));
        




    bestTrafficPath = traffic.find(
        c=>c.y==Math.min(
            ...traffic.map(c=>c.y),
        ));
    
    


    



    // logic for the worst car path
    

    //if car object is y value is 5000 more than the best car, mark damaged true
    for(let i=0; i<cars.length; i++){
        if(cars[i].y > bestPath.y + 1000){
            cars[i].damaged = true;
        }
    }
   
    //if %99 cars are damaged, save best path, discard worst, then reload page.
    if(cars.filter(c=>c.damaged).length>=cars.length*0.999999999){
       

        await discardBestCars();
        await saveBestCarLocal();
        await saveBestCarDB();
        await saveBestTraffic();
        await history.go(0);
    }

    //refresh page after 4 minutes
    setTimeout(async function(){
        await discardBestCars();
        await saveBestCarLocal();
        await saveBestCarDB();
        await history.go(0);
    }, 240000/2);

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
    // drawing the best car's neural network
    Visualizer.drawNetwork( networkCtx, bestPathDB.brain);

    requestAnimationFrame(animate);
};

/**
 * 
 */


 class Traffic {
    constructor(x, y, width, height, controlType, maxSpeed=2){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed = 0;
        this.acceleration = 3;
        this.maxSpeed = maxSpeed/1.8;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        //this.brain=controlType=="AI"; 

        // if(controlType != "AI"){
        //     this.sensor = new Sensor(this);
        //     this.brain = new NeuralNetwork(
        //         [this.sensor.rayCount, 6, 8]
        //         );
        // }
        this.controls = new Controls(controlType);
        //console.log(this.brain)
        
    }
/**
 * 
 * @param {*} roadBorders 
 * @param {*} obstacles 
 */
    update(roadBorders, obstacles){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, obstacles);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, obstacles, );
            const offsets = this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            // const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            

            // if(this.brain){
            //     this.controls.forward = outputs[0];
            //     this.controls.left = outputs[1];
            //     this.controls.right = outputs[2];
            //     this.controls.reverse = outputs[3];
            //     this.controls.forwardEase = outputs[4];
            //     this.controls.leftEase = outputs[5];
            //     this.controls.rightEase = outputs[6];
            //     this.controls.reverseEase = outputs[7];
            // }
            //console.log(outputs)

            }          
    }
/**
 * 
 * @param {*} roadBorders 
 * @param {*} obstacles 
 * @returns 
 */
    #assessDamage(roadBorders, obstacles){
        for(let i = 0; i < roadBorders.length; i++){
            if(polyIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        for(let i = 0; i < obstacles.length; i++){
            if(polyIntersect(this.polygon, obstacles[i].polygon)){
                return true;
            }
        }
    }
/**
 * 
 * @returns 
 */
    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });

        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
       
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

/**
 * 
 */
    #move(){
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
       
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed <- this.maxSpeed){
            this.speed =- this.maxSpeed;
        }

        if(this.speed>0){
            this.speed -= this.friction;
        }

        if(this.speed<0){
            this.speed += this.friction;
        }

        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }
/**
 * 
 * @param {*} ctx 
 * @param {*} color 
 * @param {*} drawSensor 
 */
    draw(ctx, color, drawSensor=false){
        if(this.damaged){
            ctx.fillStyle = "red";
        }else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

       
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }

    }
}
























// class Traffic{
//     constructor(x, y, width, height,  maxSpeed=2){
//         this.x=x;
//         this.y=y;
//         this.width=width;
//         this.height=height;

//         this.speed = 0;
//         this.acceleration = 3;
//         this.maxSpeed = maxSpeed/1.8;
//         this.friction = 0.05;
//         this.angle = 0;
//         this.damaged = false;

//         //this.trafficBrain=controlType=="trafficAI";

//         // if(controlType != "BOT"){
//         //     this.trafficSensor = new TrafficSensor(this);
//         //     this.trafficBrain = new TrafficNeuralNetwork(
//         //         [this.trafficSensor.rayCount, 2, 2]
//         //         );
//         // }
//         //this.controls = new Controls(controlType);
//         //console.log(this.trafficBrain);
//     }
    

//     update(roadBorders, obstacles, cars, traffic){
//         if(!this.damaged){
//             this.#moveTraffic();
//             this.polygon = this.#createTrafficPolygon();
//             this.damaged = this.#assessTrafficDamage(roadBorders, obstacles, cars, traffic );
//         }
//         if(this.trafficSensor){
//             this.trafficSensor.update(roadBorders, traffic, obstacles );
//             const offsets = this.trafficSensor.trafficReadings.map(
//                 s=>s==null?0:1-s.offset
//             );
//             const trafficOutputs = TrafficNeuralNetwork.feedForwardTraffic(offsets, this.trafficBrain);
            

//             // if(this.trafficBrain){
//             //     this.controls.forward = trafficOutputs[0];
                
//             //     this.controls.forwardEase = trafficOutputs[1];
                
//             // }    
//         }          
//     }

//     #assessTrafficDamage(roadBorders, traffic){
//         for(let i = 0; i < roadBorders.length; i++){
//             if(polyIntersect(this.polygon, roadBorders[i], traffic[i], cars[i])){
//                 return true;
//             }
//         }
//         for(let i = 0; i < traffic.length; i++){
//             if(polyIntersect(this.polygon, traffic[i].polygon, cars[i].polygon)){
//                 return true;
//             }
//         }
//     }

//     #createTrafficPolygon(){
//         const points=[];
//         const rad = Math.hypot(this.width, this.height)/2;
//         const alpha = Math.atan2(this.width, this.height);
//         points.push({
//             x:this.x-Math.sin(this.angle-alpha)*rad,
//             y:this.y-Math.cos(this.angle-alpha)*rad
//         });

//         points.push({
//             x:this.x-Math.sin(this.angle+alpha)*rad,
//             y:this.y-Math.cos(this.angle+alpha)*rad
//         });
       
//         points.push({
//             x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
//             y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
//         });
//         points.push({
//             x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
//             y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
//         });
//         return points;
//     }


//     #moveTraffic(){
//         if(this.controls.forward){
//             this.speed += this.acceleration;
//         }
//         if(this.controls.reverse){
//             this.speed -= this.acceleration;
//         }

//         if(this.controls.forwardEase){
//             this.speed += this.acceleration;
//         }
//         if(this.controls.reverseEase){
//             this.speed -= this.acceleration;
//         }

//         if(this.speed > this.maxSpeed){
//             this.speed = this.maxSpeed;
//         }
//         if(this.speed <- this.maxSpeed){
//             this.speed =- this.maxSpeed;
//         }

//         if(this.speed>0){
//             this.speed -= this.friction;
//         }

//         if(this.speed<0){
//             this.speed += this.friction;
//         }

//         if(Math.abs(this.speed) < this.friction){
//             this.speed = 0;
//         }

       

//         this.x -= Math.sin(this.angle) * this.speed;
//         this.y -= Math.cos(this.angle) * this.speed;
//     }

//     draw(ctx, color, drawSensor=false){
//         if(this.damaged){
//             ctx.fillStyle = "lightcoral";
//         }else{
//             ctx.fillStyle = color;
//         }
//         ctx.beginPath();
//         ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
//         for(let i=1; i<this.polygon.length; i++){
//             ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
//         }
//         ctx.fill();

       
//         if(this.trafficSensor && drawSensor){
//             this.trafficSensor.draw(ctx);
//         }
//     }
// }
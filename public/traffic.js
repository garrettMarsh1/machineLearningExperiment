
/**
 * 
 */


 class Traffic {
    constructor(x, y, width, height, controlType, maxSpeed=5){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed = 0;
        this.acceleration = 3;
        this.maxSpeed = maxSpeed/1.8;
        this.friction = 0.05;
        this.angle2= 0;
        this.damaged = false;

        this.useTrafficBrain=controlType=="AI"; 

        if(controlType != "DUMMY"){
            this.trafficSensor = new TrafficSensor(this);
            this.brain = new NeuralNetwork(
                [this.trafficSensor.rayCount, 6, 4]
                );
        }
        this.controls = new Controls(controlType);
        //console.log(this.brain)
        
    }
/**
 * 
 * @param {*} roadBorders 
 * @param {*} obstacles 
 */
    update(roadBorders, obstacles, traffic, cars){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, obstacles, traffic, cars);
        }
        if(this.trafficSensor){
            this.trafficSensor.trafficSensorUpdate(roadBorders, obstacles, traffic, cars );
            const offsets = this.trafficSensor.trafficReadings.map(
                s=>s==null?0:1-s.offset
            );
             const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            

            if(this.useTrafficBrain){
                this.controls.forward = outputs[0];
                
                this.controls.reverse = outputs[2];
                
                
            }
            //console.log(outputs)

            }          
    }




    
/**
 * 
 * @param {*} roadBorders 
 * @param {*} obstacles 
 * @returns 
 */
    #assessDamage(roadBorders, cars){
        for(let i = 0; i < roadBorders.length; i++){
            if(polyIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }


        for(let i = 0; i < cars.length; i++){
            if(polyIntersect(this.polygon, cars[i].polygon)){
                return true;
            }
        }

       for(let i = 0; i < cars.length; i++){
        if(cars.y >= (bestPath.y+5) ){
            console.log("car is out of bounds")
            console.log("car is out of bounds")
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
            x:this.x-Math.sin(this.angle2-alpha)*rad,
            y:this.y-Math.cos(this.angle2-alpha)*rad
        });

        points.push({
            x:this.x-Math.sin(this.angle2+alpha)*rad,
            y:this.y-Math.cos(this.angle2+alpha)*rad
        });
       
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle2-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle2-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle2+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle2+alpha)*rad
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

        if(this.speed = this.maxSpeed){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle2+=0.03*flip;
            }
            if(this.controls.right){
                this.angle2-=0.03*flip;
            }
        }

        this.x -= Math.sin(this.angle2) * this.speed;
        this.y -= Math.cos(this.angle2) * this.speed;
    }
/**
 * 
 * @param {*} ctx 
 * @param {*} color 
 * @param {*} drawSensor 
 */
 draw(ctx,color,drawSensor=false){
    if(this.damaged){
        ctx.fillStyle="red";
    }else{
        ctx.fillStyle=color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
    for(let i=1;i<this.polygon.length;i++){
        ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
    }
    ctx.fill();

    if(this.trafficSensor && drawSensor){
        this.trafficSensor.draw(ctx);
    }
    }
}



class TrafficSensor{
    constructor(trafficSensor){
        this.traffic=trafficSensor;
        this.rayCount=5;
        this.rayLength=150;
        this.raySpread=Math.PI/2;

        this.trafficRays=[];
        this.trafficReadings=[];
    }

    trafficSensorUpdate(roadBorders,cars){
        this.#castTrafficRays();
        this.trafficReadings=[];
        for(let i=0;i<this.trafficRays.length;i++){
            this.trafficReadings.push(
                this.#getTrafficReading(
                    this.trafficRays[i],
                    roadBorders,
                    cars
                )
            );
        }
    }

    #getTrafficReading(trafficRay,roadBorders,cars){
        let touches=[];

        for(let i=0;i<roadBorders.length;i++){
            const touch=getIntersection(
                trafficRay[0],
                trafficRay[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }

        for(let i=0;i<cars.length;i++){
            const poly=cars[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersection(
                    trafficRay[0],
                    trafficRay[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset);
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    #castTrafficRays(){
        this.trafficRays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            )+this.traffic.angle;

            const start={x:this.traffic.x, y:this.traffic.y};
            const end={
                x:this.traffic.x-
                    Math.sin(rayAngle)*this.rayLength,
                y:this.traffic.y-
                    Math.cos(rayAngle)*this.rayLength
            };
            this.trafficRays.push([start,end]);
        }
    }

    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end=this.trafficRays[i][1];
            if(this.trafficReadings[i]){
                end=this.trafficReadings[i];
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.trafficRays[i][0].x,
                this.trafficRays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.trafficRays[i][1].x,
                this.trafficRays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }        
}
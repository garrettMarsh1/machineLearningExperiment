class TrafficVisualizer {
    static drawTrafficNetwork(ctx, trafficNetwork, ){
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin*2;
        const height = ctx.canvas.height - margin*2;

        const levelHeight = height / trafficNetwork.trafficLevels.length;
       
        
        for(let i=trafficNetwork.trafficLevels.length-1;i>=0;i--){
            const levelTop=top+
                lerp(
                    height-levelHeight,
                    0,
                    trafficNetwork.trafficLevels.length==1
                        ?0.5
                        :i/(trafficNetwork.trafficLevels.length-1)
                );

            ctx.setLineDash([7,3]);

            TrafficVisualizer.drawTrafficLevel(ctx,trafficNetwork.trafficLevels[i],
                left,levelTop,
                width,levelHeight,
                i==trafficNetwork.trafficLevels.length-1
                    ?['🠉']
                    :[]

            );
        }

    }

    static drawTrafficLevel(ctx, trafficLevel, left, top, width, height, trafficOutputLabels){
        const right=left+width;
        const bottom=top+height;

        const {trafficInputs, trafficOutputs, trafficWeights, trafficBiases} = trafficLevel;

        for(let i=0;i<trafficInputs.length;i++){
            for(let j=0;j<trafficOutputs.length;j++){
                ctx.beginPath();
                ctx.moveTo(
                    TrafficVisualizer.#getTrafficNodeX(trafficInputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    TrafficVisualizer.#getTrafficNodeX(trafficOutputs, j, left, right),
                    top
                );
                ctx.lineWidth = 2;
                
                

                ctx.strokeStyle = getRGBA(trafficWeights[i][j]);
                ctx.stroke();

                }
            }

        const trafficNodeRadius=18;
        for(let i=0;i<trafficInputs.length;i++){
            const x=TrafficVisualizer.#getTrafficNodeX(trafficInputs, i, left, right)
            ctx.beginPath();
            ctx.arc(x, bottom, trafficNodeRadius, 0, Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, trafficNodeRadius*0.6, 0, Math.PI*2);
            ctx.fillStyle=getRGBA(trafficInputs[i]);
            ctx.fill();
        }
        for(let i=0;i<trafficOutputs.length;i++){
            const x=TrafficVisualizer.#getTrafficNodeX(trafficOutputs, i, left, right)
            ctx.beginPath();
            ctx.arc(x, top, trafficNodeRadius, 0, Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, trafficNodeRadius*0.6, 0, Math.PI*2);
            ctx.fillStyle=getRGBA(trafficOutputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.arc(x, top, trafficNodeRadius*0.8, 0, Math.PI*2);
            ctx.strokeStyle=getRGBA(trafficBiases[i]);
            ctx.setLineDash([3,3])
            ctx.stroke();
            ctx.setLineDash([])


            if(trafficOutputLabels[i]){
                ctx.beginPath();
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.fillStyle="black";
                ctx.strokeStyle="white";
                ctx.font = (trafficNodeRadius*1.5)+"px Arial";
                ctx.fillText(trafficOutputLabels[i],x,top + trafficNodeRadius*0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(trafficOutputLabels[i],x,top + trafficNodeRadius*0.1);
            }
        }        
     }

    static #getTrafficNodeX(nodes, index, left, right){
        return lerp(
            left,
            right,
            nodes.length==1
                ?0.5
                :index/(nodes.length-1)
        );
    }
    
}
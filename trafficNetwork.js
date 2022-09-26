class TrafficNeuralNetwork {
    constructor(neuronCounts) {
        this.trafficLevels = [];
        for (let i = 0; i < neuronCounts.length-1; i++) {
            this.trafficLevels.push(new TrafficLevel(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
        

    }
    /**
     * 
     * @param {*} givenTrafficInputs 
     * @param {*} trafficNetwork 
     * @returns 
     */
    static feedForwardTraffic(givenTrafficInputs, trafficNetwork) {
        let trafficOutputs = TrafficLevel.feedForwardTraffic(
            givenTrafficInputs, trafficNetwork.trafficLevels[0]);
        for (let i = 1; i < trafficNetwork.trafficLevels.length; i++) {
            trafficOutputs = TrafficLevel.feedForwardTraffic(
                trafficOutputs, trafficNetwork.trafficLevels[i]);
                console.log(givenTrafficInputs)
        }
        return trafficOutputs;
        
    }

    /**
     * 
     * @param {*} trafficNetwork 
     * @param {*} amount 
     */
    static mutateTraffic(trafficNetwork, amount =1){
        trafficNetwork.trafficLevels.forEach(trafficLevel => {
            for(let i = 0; i<trafficLevel.trafficBiases.length; i++){
                trafficLevel.trafficBiases[i]=lerp(
                    trafficLevel.trafficBiases[i],
                    Math.random()*2-1,
                    amount
                    
                    );
            }
            for(let i = 0; i<trafficLevel.trafficWeights.length; i++){
                for(let j = 0; j<trafficLevel.trafficWeights[i].length; j++){
                    trafficLevel.trafficWeights[i][j]=lerp(
                        trafficLevel.trafficWeights[i][j],
                        Math.random()*2-1,
                        amount
                        );
                }
            }
        }
        )
    }
}
    

class TrafficLevel {
    constructor(trafficInputCount, trafficOutputCount) {
        this.trafficInputs = new Array(trafficInputCount);
        this.trafficOutputs = new Array(trafficOutputCount);
        this.trafficBiases = new Array(trafficOutputCount);

        this.trafficWeights = [];
        for (let i = 0; i < trafficInputCount; i++) {
            this.trafficWeights[i] = new Array(trafficOutputCount);
        }
        TrafficLevel.#randomizeTraffic(this);
    }
    /**
     * 
     * @param {*} trafficLevel 
     */
    static #randomizeTraffic(trafficLevel){
        for(let i =0; i < trafficLevel.trafficInputs.length; i++){
            for(let j = 0; j < trafficLevel.trafficOutputs.length; j++){
                trafficLevel.trafficWeights[i][j] = Math.random()*2-1;
            }
        }

        for(let i = 0; i < trafficLevel.trafficBiases.length; i++){
            trafficLevel.trafficBiases[i] = Math.random()*2-1;
        }

    }
    /**
     * 
     * @param {*} givenTrafficInputs 
     * @param {*} trafficLevel 
     * @returns 
     */
    static feedForwardTraffic(givenTrafficInputs, trafficLevel) {
        for(let i=0;i<trafficLevel.trafficInputs.length;i++){
            trafficLevel.trafficInputs[i] = givenTrafficInputs[i];
        }

        for(let i = 0; i<trafficLevel.trafficOutputs.length; i++){
            let sum = 0;
            for(let j = 0; j<trafficLevel.trafficInputs.length; j++){
                sum += trafficLevel.trafficInputs[j]*trafficLevel.trafficWeights[j][i];
            }

            if(sum>trafficLevel.trafficBiases[i]>0){
                trafficLevel.trafficOutputs[i] = 1;
            }else{
                trafficLevel.trafficOutputs[i] = 0;
            }
        }    
        return trafficLevel.trafficOutputs  
    }
}

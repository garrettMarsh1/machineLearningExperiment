class TrafficNeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        for (let i = 0; i < neuronCounts.length-1; i++) {
            this.levels.push(new TrafficLevel(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    static feedForwardTraffic(givenInputs, network) {
        let outputs = TrafficLevel.feedForwardTraffic(
            givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = TrafficLevel.feedForwardTraffic(
                outputs, network.levels[i]);
        }
        return outputs;
    }

    static mutateTraffic(network, amount =1){
        network.levels.forEach(level => {
            for(let i = 0; i<level.biases.length; i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                    
                    );
            }
            for(let i = 0; i<level.weights.length; i++){
                for(let j = 0; j<level.weights[i].length; j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
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
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
        TrafficLevel.#randomizeTraffic(this);
    }

    static #randomizeTraffic(level){
        for(let i =0; i < level.inputs.length; i++){
            for(let j = 0; j < level.outputs.length; j++){
                level.weights[i][j] = Math.random()*2-1;
            }
        }

        for(let i = 0; i < level.biases.length; i++){
            level.biases[i] = Math.random()*2-1;
        }

    }

    static feedForwardTraffic(givenInputs, level) {
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i] = givenInputs[i];
        }

        for(let i = 0; i<level.outputs.length; i++){
            let sum = 0;
            for(let j = 0; j<level.inputs.length; j++){
                sum += level.inputs[j]*level.weights[j][i];
            }

            if(sum>level.biases[i]>0){
                level.outputs[i] = 1;
            }else{
                level.outputs[i] = 0;
            }
        }    
        return level.outputs  
    }
}

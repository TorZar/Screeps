var varConstants = require('var.constants');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = false;
            creep.say('Harvesting..')
        }
        if (!creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = true;
            creep.say('Delivering..')
        }

        if (creep.memory.harvesting) {
            
            
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity ||
                        structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity ||
                        structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity ||
                        structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
                    );   
                }
            })
            
            if (targets.length > 0) {

                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                };
            } else {
                creep.moveTo(Game.spawns['Spawn1'])
                if (varConstants.SPEAKABLE) {
                    creep.say('Homing...');
                };
            }

        } else {

            var sources = creep.room.find(FIND_SOURCES);
            /*  ### CODE TO HARVEST ANY FREE SOURCE ###  */

            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0])
            }
        }
    }
}

module.exports = roleHarvester;

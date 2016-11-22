/* testing git */
var varConstants = require('var.constants');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {



        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if (creep.memory.building) {
            var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets);
            }

        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }



        /*      ####    TESTING REPAIR FEATURE      ####    START    */
        /* var targetsRepair = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });*/


        var targetsRepair = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        targetsRepair.sort((a, b) => a.hits - b.hits);

        var targetsBuild = creep.room.find(FIND_CONSTRUCTION_SITES);

        if (targetsRepair.length > 0 && targetsBuild.length < 1) {
            if (creep.repair(targetsRepair[0]) == ERR_NOT_IN_RANGE) {


                if (varConstants.SPEAKABLE) {
                    creep.say('Repairing');
                };



                creep.moveTo(targetsRepair[0]);
            }
        }
        /*      ####    TESTING REPAIR FEATURE      ####    END    */



    }
};

module.exports = roleBuilder;

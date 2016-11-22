var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function() {
    var varConstants = '';
    var varConstants = require('var.constants');

    var spawnEnergy = Game.spawns['Spawn1'].energy

    /*      console.log(Room.energyAvailable + '/' + Game.spawns['Spawn1'].energyCapacity)      */
    /*      && Game.spawns['Spawn1'].energy === Game.spawns['Spawn1'].energyCapacity            */

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing non-existing creep memory', name)
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder')

    if (harvesters.length < varConstants.HARVESTER_MIN) { /* && spawnEnergy === Game.spawns['Spawn1'].energyCapacity */

        var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, {
            role: 'harvester'
        })
        console.log('Spawning new : ' + newName + ' The HARVESTER')

    } else {

        if (upgraders.length < varConstants.UPGRADER_MIN) { /* && spawnEnergy === Game.spawns['Spawn1'].energyCapacity */
            var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, {
                role: 'upgrader'
            })
            console.log('Spawning new : ' + newName + ' The UPGRADER')
        }

        if (builders.length < varConstants.BUILDER_MIN) { /* && spawnEnergy === Game.spawns['Spawn1'].energyCapacity */
            var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, {
                role: 'builder'
            })
            console.log('Spawning new : ' + newName + ' The BUILDER')
        }
    };

    console.log('Harvesters :  ' + harvesters.length + ' / ' + varConstants.HARVESTER_MIN)
    console.log('Upgraders :  ' + upgraders.length + ' / ' + varConstants.UPGRADER_MIN)
    console.log('Builders :  ' + builders.length + ' / ' + varConstants.BUILDER_MIN)
    console.log('Spawn Energy : ' + spawnEnergy + '/' + Game.spawns['Spawn1'].energyCapacity + ' Total Energy : ' + Room.energyCapacity)

    var tower = Game.getObjectById('a1cd17bbd04928fd88e0ef96')
    if (tower) {

        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure)
        }


        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (closestHostile) {
            tower.attack(closestHostile)
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

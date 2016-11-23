var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var varConstants = require('var.constants');

module.exports.loop = function() {

   Memory._allEnergy = {
        _allEnergy: Room.energy
    }
    
    var spawnEnergy = Game.spawns['Spawn1'].energy

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing non-existing creep memory', name)
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder')

    if (harvesters.length < varConstants.HARVESTER_MIN) {

        var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'HARVESTER_2_' + (Math.floor(Math.random() * 65534) + 1), {
            role: 'harvester'
        })
        console.log('Spawning new : ' + newName + ' The HARVESTER')

    } else {

        if (upgraders.length < varConstants.UPGRADER_MIN) { 
            var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], 'UPGRADER_' + (Math.floor(Math.random() * 65534) + 1), {
                role: 'upgrader'
            })
            console.log('Spawning new : ' + newName + ' The UPGRADER')
        }

        if (builders.length < varConstants.BUILDER_MIN) { 
            var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], 'BUILDER_' + (Math.floor(Math.random() * 65534) + 1), {
                role: 'builder'
            })
            console.log('Spawning new : ' + newName + ' The BUILDER')
        }
    };

    /* LOG DISPLAY TIMER - START */
    if (!Memory.logTimer.toNextDisplay) {
        Memory.logTimer = {
            toNextDisplay: 5
        }
        console.log('HARD-SET LOG TIMER TO MEMEORY')
    };

    if (Memory.logTimer.toNextDisplay === 1) {

        console.log('<font color="green">Harvesters :</font><font color="white"> ' + harvesters.length + ' / ' + varConstants.HARVESTER_MIN + '</font>' +
            ' | ' + '<font color="orange">Upgraders :</font><font color="white"> ' + upgraders.length + ' / ' + varConstants.UPGRADER_MIN + '</font>' +
            ' | ' + '<font color="#464CC5">Builders :</font><font color="white"> ' + builders.length + ' / ' + varConstants.BUILDER_MIN + '</font>' +
            ' | ' + '<font color="yellow">Spawn Energy :</font> ' + spawnEnergy + '/' + Game.spawns['Spawn1'].energyCapacity + 
            ' | ' + 'All Energy : ' + Memory._allEnergy._allEnergy +
            ' | ' + 'Tick : ' + Game.time);

        Memory.logTimer.toNextDisplay = 6
        
    } else {
        var logCountdown = Memory.logTimer.toNextDisplay - 1
        Memory.logTimer.toNextDisplay = logCountdown
        
    };
    /* DEBUG : console.log('Log Countdown : ' + Memory.logTimer.toNextDisplay) */
    /* LOG DISPLAY TIMER - END */

    /* TOWER OPERATION - START */

    var tower = Game.getObjectById('103f1c91b5ce9ff')
    if (tower) {

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (closestHostile) {
            tower.attack(closestHostile)
        }

        var closestHurt = tower.pos.findClosestByRange(FIND_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax
        });
        if (closestHurt) {
            tower.heal(closestHurt)
        }

        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure)
        }

    }

    /* TOWER OPERATION - END */

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

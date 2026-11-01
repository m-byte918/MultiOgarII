const FFA = require('./FFA'); // Base gamemode
const Entity = require('../entity');

class Experimental extends FFA {
    constructor() {
        super();
        this.ID = 2;
        this.name = "Experimental";
        this.specByLeaderboard = true;
        // Gamemode Specific Variables
        this.nodesMother = [];
        // Config
        this.motherAmount = 10;
    }
    // Gamemode Specific Functions
    spawnMotherCells(server) {
        let diff = this.motherAmount - this.nodesMother.length;
        while (--diff >= 0) {
            const mother = new Entity.MotherCell(server, null, server.randomPos(), 149);
            server.safeSpawn(mother);
        }
    }
    spawnCells(server) {
        this.spawnMotherCells(server);
    }
    // Override
    onServerInit(server) {
        // Called when the server starts
        server.run = true;
        // Ovveride functions for special virus mechanics
        var self = this;
        Entity.Virus.prototype.onEat = function (prey) {
            // Pushes the virus
            this.setBoost(220, prey.boostDirection.angle());
        };
        Entity.MotherCell.prototype.onAdd = function () {
            self.nodesMother.push(this);
        };
        Entity.MotherCell.prototype.onRemove = function () {
            self.nodesMother.removeUnsorted(this);
            self.spawnMotherCells(server);
        };
        self.spawnCells(server);
    }
    onTick(server) {
        var updateInterval;
        for (const motherCell of this.nodesMother) {
            if (motherCell.radius <= motherCell.motherCellMinSize)
                updateInterval = Math.random() * (50 - 25) + 25;
            else updateInterval = 2;
            if ((server.ticks % ~~updateInterval) === 0)
                motherCell.onUpdate();
        }
    }
}

module.exports = Experimental;

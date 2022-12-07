class PlayerCharacter {
    constructor(name, gender, job) {
        this.name = name;
        this.gender = gender;
        this.job = job;
        this.equipment = {
            weapon: masterItemList.weapons[this.job.startingWeapon].generateItem(),
            helmet: 'none',
            armor: masterItemList.armor[this.job.startingArmor].generateItem(),
            accessory: 'none',
        }
        this.maxHP = this.job.startingHP;
        this.damage = 0;
        this.maxMP = this.job.startingMP;
        this.spentMP = 0;
        this.str = this.job.startingStr;
        this.dex = this.job.startingDex;
        this.speed = this.job.startingSpeed;
        this.sta = this.job.startingSta;
        this.int = this.job.startingInt;
        this.luck = this.job.startingLuck;
        this.status = 'none';
    }

    get attack() {
        let damage = 0;
        let randomInt = randomNumberGenerator(1, 10);
        let attack = this.equipment.weapon.attack;
        if (isEven(randomInt)) {
            const extraDamage = randomNumberGenerator(0, this.equipment.weapon.attackRange);
            attack += extraDamage;
        }
        else {
            attack -= randomNumberGenerator(0, this.equipment.weapon.attackRange);
        }
        if (this.equipment.weapon.weight === 'light') {
            damage = Math.round(((2 * attack) + 2 * this.dex) / 3);
        }
        else {
            damage = Math.round(((2 * attack) + this.str) / 3);
        }
        if (damage > 1) return damage;
        else return 1;
    }

    get currentHP() {
        return this.maxHP - this.damage;
    }

    get currentMP() {
        return this.maxMP - this.spentMP;
    }

    get pronoun() {
        if (this.gender === 'male') {
            return 'he';
        }
        else if (this.gender === 'female') {
            return 'she';
        }
        else if (this.gender === 'non-binary') {
            return 'they';
        }
    }

    equipGear(gear) {
        if (gear.type === 'melee weapon' || 'ranged weapon') {
            this.equipment.weapon = gear;
        }

        else if (gear.type === 'helmet') {
            this.equipment.helmet = gear;
        }

        else if (gear.type === 'armor') {
            this.equipment.armor = gear;
        }

        else if (gear.type === 'accessory') {
            this.equipment.accessory = gear;
        }
        gear.equipped = true;
    }

    removeGear(gear) {
        if (gear.name !== 'bare hands') {
            if (gear.type === 'melee weapon' || 'ranged weapon') {
                this.equipment.weapon = masterItemList.weapons.bareHands.generateItem();
            }

            else if (gear.type === 'helmet') {
                this.equipment.helmet = '';
            }

            else if (gear.type === 'armor') {
                this.equipment.armor = '';
            }

            else if (gear.type === 'accessory') {
                this.equipment.accessory = '';
            }
            gear.equipped = false;
        }
    }
}
function startCombat() {
    renderScreen(screens.battle)
    console.log(party);
    let partyIndex = 0;
    const enemyArea = document.querySelector('#enemy-area');
    const commands = document.querySelector('#commands')
    const combatLog = document.querySelector('#combat-log')
    const currentArea = 'area1';
    const encounterSize = getEncounterSize();
    let exp = 0;
    let gold = 0;
    let currentEnemies = getEnemies(currentArea, encounterSize);
    let msg;
    showParty(); 
    if (currentEnemies.length > 1) {
        msg = `
            <p>${currentEnemies.length} <span class='tomato'>enemies</span> have arrived!</p>
        `
    }
    else if (currentEnemies.length === 1) {
        msg = `
            <p>${currentEnemies.length} <span class='tomato'>enemy</span> has arrived!</p>
        `
    }
    for (let i = 0; i < currentEnemies.length; i++) {
        msg += `
            <p>A <span class='tomato'>${currentEnemies[i].name}</span> is here!</p>
        `
    }
    printMessage(msg);
    displayEnemies(currentEnemies)
    msg = '<p class="turqoise">What would you like to do?</p>';
    printMessage(msg);
    getCombatInput();


    commands.addEventListener('click', (e) => {
        if (e.target.type === "button") {
            if (e.target.id === 'attack-btn') {
                playerAttack();
            }
            else if (e.target.id === 'attack-0') {
                processAttack(currentEnemies[0]);
            }
            else if (e.target.id === 'attack-1') {
                processAttack(currentEnemies[1]);
            }
            else if (e.target.id === 'attack-2') {
                processAttack(currentEnemies[2]);
            }
            else if (e.target.id === 'back') {
                clearCommands();
                getCombatInput();
            }
            
            else if (e.target.id === 'next') {
                renderScreen(screens.postBattle);
                postCombat(party);
            }
        }
    })

    function processAttack(enemy) {
        const attack = party.members[partyIndex].attack;
        const damage = damageFormula(attack, enemy.defense)
        enemy.damage += damage;
        printMessage(`<p><span class='player'>${party.members[partyIndex].name}</span> hits ${enemy.name} for ${damage} points of damage!</p>`)
        if (enemy.currentHP <= 0) {
            enemy.status = 'dead.'
            enemy.alive = false;
            printMessage(`<p><span class='tomato'>${capitalizeWord(enemy.name)}</span> has been <span class='red'>slain</span>!</p>`)

            const element = document.querySelector(`[data-index="${enemy.index}"]`);
            element.style.display = 'none';
            if (currentEnemies.length > 1) {
                currentEnemies.splice(enemy.index, 1)
            }
            else (currentEnemies.pop())
            exp += enemy.exp;
            gold += enemy.gold;
        }
        if (currentEnemies.length > 0) {
            enemyStatus();
            clearCommands();
            getCombatInput();
        }
        else {
            printMessage(`<p>Enemies defeated!<p>`);
            printMessage(`<p><span class="player">The party</span> earns <span class='gold'>${gold} gold</span> and <span class='exp'>${exp} experience points</span>!</p>`)
            party.gold += gold;
            party.exp += exp;
            printMessage(`<p><span class="player">The party</span> has a total of <span class='gold'>${party.gold} gold</span> and <span class='exp'>${party.exp} experience points</span>!</p>`)
            clearCommands();
            clearEnemyArea();
            commands.innerHTML = `<button type='button' id='next' class='btn btn-danger col-3'>Next</button>`
        }
        if (partyIndex < 3) partyIndex++;
        else partyIndex = 0;
    }

    function clearEnemyArea() {
        enemyArea.innerHTML = '';
    }

    function clearCommands() {
        commands.innerHTML = '';
    }

    function getEncounterSize() {
        const randomNumber = randomNumberGenerator(1, 100)
        if (randomNumber >= 75) {
            return 3;
        }
        else if (randomNumber >= 50) {
            return 1;
        }
        else {
            return 2;
        }
    }

    function getCurrentEnemies(enemyList, enemyPartySize) {
        const currentEnemies = [];
        for (let i = 0; i < enemyPartySize; i++) {
            const enemyIndex = randomNumberGenerator(0, enemyList.length - 1)
            const currentEnemy = enemyList[enemyIndex];
            currentEnemy.index = i;
            currentEnemies.push(enemyList[enemyIndex])
        }
        return currentEnemies;
    }

    function getEnemies(area, encounterSize) {
        const potentialEnemies = enemiesByArea[area];
        const enemyList = getCurrentEnemies(potentialEnemies, encounterSize);
        const currentEnemies = [];
        for (let i = 0; i < enemyList.length; i++) {
            currentEnemies.push(masterEnemyList[enemyList[i]].generateEnemy(i))
        }
        return currentEnemies;
    }

    function displayEnemies(enemyList) {
        let imgHtml = '';
        if (enemyList.length === 1) {
            let i = 0;
                imgHtml = `<div data-name='${enemyList[i].name}' data-index='${i}' class='col-${4} center enemy-div'><img src='img/${enemyList[i].img}'></div>`;
        }
        else if (enemyList.length >= 2) {
            for (let i = 0; i < enemyList.length; i++) {
                imgHtml += `<div data-name='${enemyList[i].name}' data-index='${i}' class='col-${12/enemyList.length} center enemy-div'><img src='img/${enemyList[i].img}'></div>`;
            }
        }
        enemyArea.insertAdjacentHTML('beforeend', imgHtml);
    }

    function playerAttack() {
        clearCommands();
        let enemyHtml = '';
        for (let i = 0; i < currentEnemies.length; i++) {
            enemyHtml += `<div class='col-3 command'><button type="button" id="attack-${i}" class="mt-3 btn btn-danger">Enemy ${i + 1}<br> ${capitalizeWord(currentEnemies[i].name)}</button></div>`;
        }
        enemyHtml += `<div class='col-3 command'><button type="button" id="back" class="mt-3 btn btn-info">Back</button></div>`;
        commands.innerHTML = enemyHtml;
    }

    function getCombatInput() {
        const attack = `<div class='col-3 command'><button type="button" id="attack-btn" class="mt-3 btn btn-danger">Attack!</button></div>`;
        commands.insertAdjacentHTML('beforeend', attack);
    }
    

    function enemyStatus() {
        for (let i = 0; i < currentEnemies.length; i++) {
            const enemy = currentEnemies[i];
            msg = `
            <p><span class=tomato>${capitalizeWord(enemy.name)}</span> is ${enemy.status} The <span class=tomato>${enemy.name}</span> ${enemy.healthState}</p>
        `;
            printMessage(msg);
        }
    }

    function scrollToBottom() {
        combatLog.scrollTop = combatLog.scrollHeight;
    }

    function showParty() {
        const partyDiv = document.querySelector('#party');
        let html = '';
        for (let i = 0; i < party.members.length; i++) {
            const character = party.members[i];
            html +=
                `
                <div data-character="${character.name}" class="card col-3 p-3 text-center">
                    <img src="${character.job.img}" class="card-img-top mx-auto" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${capitalizeWord(character.name)}</h5>
                        <p class="card-text">HP: ${character.maxHP}/${character.currentHP}</p>
                        <p class="card-text">HP: ${character.maxMP}/${character.currentMP}</p>
                    </div>
                </div>
            `;
        }
        partyDiv.innerHTML = html;
        divFocus(document.querySelector(`[data-character="${party.members[0].name}"]`))
    }

    function printMessage(message) {
        combatLog.insertAdjacentHTML('beforeend', message);
        scrollToBottom();
    }
}



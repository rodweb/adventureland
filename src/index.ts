const merchantName = 'RodMerchant';

const allChars = [
  {
    name: 'RodWarrior',
    enabled: true,
  },
  {
    name: 'RodMage',
    enabled: true,
  },
  {
    name: 'RodRogue',
    enabled: false,
  },
  {
    name: 'RodPriest'
  },
  {
    name: 'RodRanger',
    enabled: true,
  },
  {
    name: 'RodPaladin'
  }
];

let attack_mode = true;

(async () => {
  await load_characters();
  setup_party();
  setInterval(loop, 1000 / 4);
})();

function loop() {
  use_hp_or_mp();
  loot();
  join_party();

  if (!attack_mode || character.rip || is_moving(character)) {
    return;
  }

  let target = get_targeted_monster();
  if (!target) {
    target = get_nearest_monster({ min_xp: 100, max_att: 120 });

    if (target) {
      change_target(target);
    } else {
      set_message("No Monsters");
      return;
    }
  }

  if (!is_in_range(target)) {
    // Walk half the distance
    move(
      character.x + (target.x - character.x) / 2,
      character.y + (target.y - character.y) / 2,
    );
  } else if (can_attack(target)) {
    set_message("Attacking");
    attack(target);
  }
};

async function load_characters() {
  if (character.ctype !== 'merchant') {
    return;
  }
  attack_mode = false;
  for (const char of allChars) {
    await stop_character(char.name);
  }
  for (const char of allChars.filter(char => char.enabled)) {
    start_character(char.name);
  }
}

function setup_party() {
  if (character.ctype !== 'merchant') {
    return;
  }
  const charNames = new Set(allChars.map(char => char.name))
  on_party_request = (name) => {
    if (charNames.has(name)) {
      accept_party_request(name);
    }
  }
}

function join_party() {
  if (!character.party) {
    send_party_request(merchantName);
  }
}

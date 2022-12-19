let attack_mode = true;

load_characters();

setInterval(() => {
  use_hp_or_mp();
  loot();

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
}, 1000 / 4); // Loops every 1/4 seconds.

function load_characters() {
  const charNames = new Set(['RodWarrior', 'RodMage', 'RodRogue', 'RodPriest', 'RodRanger', 'RodPaladin'])
  if (character.ctype === 'merchant') {
    for (const name of charNames) {
      stop_character(name);
    }
    start_character('RodWarrior');
    start_character('RodMage');
    start_character('RodPaladin');
    attack_mode = false;
  }
}

import { baseTurnConsumption, initialResources } from '../data/missions.js';

const clamp = (n) => Math.max(0, Math.min(100, n));

export function freshGame() {
  return {
    turn: 0,
    phase: 'intro', // 'intro' | 'play' | 'report' | 'result'
    resources: { ...initialResources },
    flags: {
      var_comunicaciones: 0,
      var_zona_aterrizaje: 0,
      var_reparacion_base: 0,
      var_paneles_limpios: 0,
      var_modo_ahorro: 0,
    },
    decisionEffect: null,
    baseConsumptionApplied: null,
    report: null,
    history: [],
    entryNotes: [],
    resultReason: null,
  };
}

export function startGame() {
  return { ...freshGame(), turn: 0, phase: 'play' };
}

function applyEffects(resources, effects) {
  const next = { ...resources };
  for (const [key, amount] of Object.entries(effects ?? {})) {
    next[key] = clamp((next[key] ?? 0) + amount);
  }
  return next;
}

export function chooseOption(game, mission, option) {
  const before = { ...game.resources };
  const resourcesAfterDecision = applyEffects(before, option.effects);

  const flags = {
    ...game.flags,
    ...(option.flag ? { [option.flag]: option.flagValue ?? 1 } : {}),
  };

  // Special dualGuidance handling for Mission 6 Option C
  if (option.flag === 'dualGuidance') {
    flags.var_comunicaciones = 1;
    flags.var_zona_aterrizaje = 1;
  }

  const decisionDelta = Object.fromEntries(
    Object.keys(resourcesAfterDecision).map((key) => [
      key,
      resourcesAfterDecision[key] - before[key],
    ])
  );

  return {
    ...game,
    resources: resourcesAfterDecision,
    flags,
    phase: 'report',
    decisionEffect: decisionDelta,
    report: {
      missionId: mission.id,
      optionId: option.id,
      title: option.title,
      outcome: option.outcome,
      lesson: option.lesson,
    },
    history: [
      ...game.history,
      {
        missionId: mission.id,
        optionId: option.id,
        title: option.title,
        effects: option.effects,
      },
    ],
  };
}

export function continueAfterReport(game, missionCount) {
  // Step 5 of GDD: Apply base turn consumption (Energía -5, Soporte -3, Suministros -4)
  const beforeConsumption = { ...game.resources };
  const resourcesAfterBase = applyEffects(beforeConsumption, baseTurnConsumption);

  const consumptionDelta = Object.fromEntries(
    Object.keys(resourcesAfterBase).map((key) => [
      key,
      resourcesAfterBase[key] - beforeConsumption[key],
    ])
  );

  // Step 6 of GDD: Check if any indicator reached 0 (Emergency Defeat)
  for (const [key, val] of Object.entries(resourcesAfterBase)) {
    if (val <= 0) {
      return {
        ...game,
        resources: resourcesAfterBase,
        phase: 'result',
        result: 'finalD',
        resultReason: key,
        baseConsumptionApplied: consumptionDelta,
      };
    }
  }

  const nextTurn = game.turn + 1;

  // Final check at the end of turn 6 (all 6 missions completed)
  if (nextTurn >= missionCount) {
    const flags = game.flags;
    const { energy, life, supplies, safety } = resourcesAfterBase;

    let endingType = 'finalC'; // default: vessel remains in orbit

    const commsOk = flags.var_comunicaciones === 1;
    const landingOk = flags.var_zona_aterrizaje === 1;
    const baseRepaired = flags.var_reparacion_base === 1;

    if (commsOk && landingOk && baseRepaired) {
      endingType = 'finalA'; // Safe touchdown
    } else if (commsOk && landingOk) {
      endingType = 'finalB'; // Survival with limited reserves
    } else {
      endingType = 'finalC'; // Vessel remains in orbit
    }

    return {
      ...game,
      resources: resourcesAfterBase,
      phase: 'result',
      result: endingType,
      baseConsumptionApplied: consumptionDelta,
    };
  }

  // Turn entry bonuses and consequences
  const entryNotes = [];
  let updatedResources = { ...resourcesAfterBase };

  // If panels were cleaned in Mission 1, recover solar power in subsequent turns
  if (nextTurn === 1 && game.flags.var_paneles_limpios === 1) {
    updatedResources = applyEffects(updatedResources, { energy: 6 });
    entryNotes.push('Cleaned photovoltaic panels restore +6 Energy as storm clearing begins.');
  }

  if (nextTurn === 1 && game.flags.var_modo_ahorro === 1) {
    entryNotes.push('Power-saving mode active: non-essential research postponed.');
  }

  return {
    ...game,
    turn: nextTurn,
    phase: 'play',
    resources: updatedResources,
    report: null,
    decisionEffect: null,
    baseConsumptionApplied: consumptionDelta,
    entryNotes,
  };
}

export function resourceStatus(value, lang = 'en') {
  if (lang === 'es') {
    if (value >= 80) return 'ÓPTIMO';
    if (value >= 60) return 'ESTABLE';
    if (value >= 40) return 'PRECAUCIÓN';
    if (value >= 20) return 'CRÍTICO';
    return 'EMERGENCIA';
  }
  if (value >= 80) return 'OPTIMAL';
  if (value >= 60) return 'STABLE';
  if (value >= 40) return 'CAUTION';
  if (value >= 20) return 'CRITICAL';
  return 'EMERGENCY';
}

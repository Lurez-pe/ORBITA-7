import { initialResources } from '../data/missions.js';

const clamp = (n) => Math.max(0, Math.min(100, n));

export function freshGame() {
  return {
    turn: 0,
    phase: 'intro',
    resources: { ...initialResources },
    flags: { waterReserveAvailable: true, oxygenReserveAvailable: true },
    report: null,
    reportChanges: null,
    history: [],
  };
}

export function startGame() {
  return { ...freshGame(), turn: 0, phase: 'play' };
}

function applyEffects(resources, effects) {
  const next = { ...resources };
  for (const [key, amount] of Object.entries(effects ?? {})) next[key] = clamp((next[key] ?? 0) + amount);
  return next;
}

export function chooseOption(game, mission, option) {
  if ((option.needsReserve === 'water' && !game.flags.waterReserveAvailable)
    || (option.needsReserve === 'oxygen' && !game.flags.oxygenReserveAvailable)) return game;
  const before = game.resources;
  let resources = applyEffects(before, option.effects);
  const flags = {
    ...game.flags,
    [option.flag]: true,
    ...(option.needsReserve === 'water' ? { waterReserveAvailable: false } : {}),
    ...(option.needsReserve === 'oxygen' ? { oxygenReserveAvailable: false } : {}),
  };
  const teamworkCost = option.teamwork && before.morale < 60 ? 5 : 0;
  if (teamworkCost) resources = applyEffects(resources, { energy: -teamworkCost });
  const changes = Object.fromEntries(Object.keys(resources).map((key) => [key, resources[key] - before[key]]));
  return {
    ...game,
    resources,
    flags,
    phase: 'report',
    report: {
      missionId: mission.id,
      optionId: option.id,
      title: option.title,
      outcome: option.outcome,
      lesson: option.lesson,
      teamworkCost,
    },
    reportChanges: changes,
    history: [...game.history, { missionId: mission.id, optionId: option.id, title: option.title }],
  };
}

export function useWellbeingProtocol(game) {
  if (game.flags.wellbeingUsed) return game;
  return {
    ...game,
    resources: applyEffects(game.resources, { morale: 10 }),
    flags: { ...game.flags, wellbeingUsed: true },
  };
}

function applyTurnEntry(game, nextTurn) {
  let resources = game.resources;
  const flags = game.flags;
  let entryNotes = [];
  if (nextTurn === 1 && flags.savingMode) entryNotes.push('El modo de ahorro limita temporalmente el invernadero y la producción de alimentos.');
  if (nextTurn === 2) {
    if (flags.panelsInspected || flags.panelsCleaned) {
      const bonus = flags.panelsInspected ? 8 : 5;
      resources = applyEffects(resources, { energy: bonus });
      entryNotes.push(`Los paneles recuperan +${bonus} de Energía.`);
    }
  }
  if (nextTurn === 4 && flags.irrigationReduced) entryNotes.push('El riego reducido deja menos margen para el cultivo.');
  // nextTurn is a zero-based mission index: 4 is mission 5 (fuga).
  if (nextTurn === 4) {
    resources = applyEffects(resources, { protection: -20, life: -5, ...(flags.loadsReduced ? { energy: 5 } : {}) });
    entryNotes.push('El daño de la fuga reduce Protección −20 y Soporte vital −5.');
    if (flags.loadsReduced) entryNotes.push('Las cargas secundarias apagadas aportan +5 de Energía.');
  }
  if (nextTurn === 5 && flags.temporarySeal) entryNotes.push('Revisa el sellado temporal antes de la llegada.');
  return { ...game, resources, flags, entryNotes };
}

export function continueAfterReport(game, missionCount) {
  let resources = applyEffects(game.resources, { energy: -5, life: -5 });
  const closedTurn = { ...game, resources };
  const nextTurn = game.turn + 1;
  if (resources.life <= 0 || (resources.protection <= 0 && !(game.flags.moduleIsolated || game.flags.finalRepair))) {
    return { ...closedTurn, phase: 'result', result: 'failure', turn: game.turn, entryNotes: [] };
  }
  if (nextTurn >= missionCount) {
    const contained = game.flags.moduleIsolated || game.flags.finalRepair || game.flags.temporarySeal;
    const success = resources.life >= 40 && (resources.protection >= 40 || contained) && game.flags.siteInspected && (game.flags.communications || game.flags.beacon);
    const partial = resources.life >= 20 && contained && (game.flags.siteInspected || game.flags.communications || game.flags.beacon);
    return { ...closedTurn, phase: 'result', result: success ? 'success' : partial ? 'partial' : 'risk', turn: game.turn, entryNotes: [] };
  }
  const advanced = applyTurnEntry({ ...closedTurn, turn: nextTurn, phase: 'play', report: null, reportChanges: null }, nextTurn);
  return { ...advanced, entryNotes: advanced.entryNotes ?? [] };
}

export function resourceStatus(value) {
  if (value >= 80) return 'Óptimo';
  if (value >= 60) return 'Estable';
  if (value >= 40) return 'Bajo';
  if (value >= 20) return 'Crítico';
  return 'Emergencia';
}

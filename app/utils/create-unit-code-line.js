import UnitCodeLine from 'tower-defense/objects/unit-code-line';

function addUidToUnitCodeLine(unitCodeLine) {
  // TODO THIS COMMIT: this is not a legitimate UID. Implement better code.
  unitCodeLine.id = Math.floor((Math.random() * 100000) + 1);
}

export default function createUnitCodeLine() {
  const unitCodeLine = UnitCodeLine.create();

  addUidToUnitCodeLine(unitCodeLine);

  return unitCodeLine;
}

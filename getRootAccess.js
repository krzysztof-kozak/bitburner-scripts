export async function main(ns) {
  const {
    args: [target],
    fileExists,
    brutessh,
    ftpcrack,
    relaysmtp,
    sqlinject,
    httpworm,
    nuke,
    hasRootAccess,
    tprint,
  } = ns;

  const attacks = [
    { fileName: 'Brutessh.exe', function: brutessh },
    { fileName: 'FTPCrack.exe', function: ftpcrack },
    { fileName: 'HTTPWorm.exe', function: httpworm },
    { fileName: 'relaySMTP.exe', function: relaysmtp },
    { fileName: 'SQLInject.exe', function: sqlinject },
  ];

  const verifyFile = (filename) => fileExists(filename);

  attacks.forEach((attack) => {
    if (verifyFile(attack.fileName) && !hasRootAccess(target)) {
      attack.function(target);
    }
  });

  tprint(`${target} Root Access: ${hasRootAccess(target)}`);
}

export async function main(ns) {
  const {
    scp,
    getServerMaxRam,
    getScriptRam,
    exec,
    getPurchasedServers,
    killall,
    getServerUsedRam,
    hackAnalyzeThreads,
    getServerMaxMoney,
  } = ns;

  const purchasedServers = getPurchasedServers();
  const targets = [
    'rothman-uni',
    'catalyst',
    'syscore',
    'comptek',
    'summit-uni',
    'netlink',
    'rho-construction',
    'alpha-ent',
    'aevum-police',
    'lexo-corp',
  ];
  let numOfTargets = targets.length;

  purchasedServers.forEach((server) => {
    killall(server);
    scp(['/scripts/perma-weaken.js', '/scripts/perma-grow.js', '/scripts/perma-hack.js'], server);
  });

  purchasedServers.forEach((server) => {
    runScripts(server);
  });

  function runScripts(server) {
    targets.forEach((target) => {
      let currentServerRam = Math.floor(getServerMaxRam(server) / numOfTargets);

      const hackRamRequired = getScriptRam('/scripts/perma-hack.js');
      const growRamRequired = getScriptRam('/scripts/perma-grow.js');
      const weakenRamRequired = getScriptRam('/scripts/perma-weaken.js');

      const weakenThreads = Math.floor((currentServerRam / weakenRamRequired) * 0.1);
      const hackThreads = Math.floor((currentServerRam / hackRamRequired) * 0.2);

      exec('/scripts/perma-weaken.js', server, weakenThreads, target);
      exec('/scripts/perma-hack.js', server, hackThreads, target);

      currentServerRam = Math.floor(
        getServerMaxRam(server) / numOfTargets - (weakenThreads * weakenRamRequired + hackThreads * hackRamRequired)
      );

      let growThreads = Math.floor(currentServerRam / growRamRequired);
      exec('/scripts/perma-grow.js', server, growThreads, target);
    });
  }
}

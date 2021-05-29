export async function main(ns) {
  const { scp, getServerMaxRam, getScriptRam, exec, getPurchasedServers, killall } = ns;

  const purchasedServers = getPurchasedServers();
  const targets = ['joesguns'];
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

      let weakenThreads = Math.floor((currentServerRam / weakenRamRequired) * 0.002);
      let hackThreads = Math.floor((currentServerRam / hackRamRequired) * 0.001);

      if (weakenThreads < 1) {
        weakenThreads = Math.floor((currentServerRam / weakenRamRequired) * 0.2);
      }

      if (hackThreads < 1) {
        hackThreads = Math.floor((currentServerRam / hackRamRequired) * 0.1);
      }

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
